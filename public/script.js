// Saarthi AI App Logic

const app = {
    // Data Models
    foodMenu: [
        { id: 'f1', name: 'Margherita Pizza', price: '$12', baseWaitTime: 12 },
        { id: 'f2', name: 'Classic Burger', price: '$8', baseWaitTime: 8 },
        { id: 'f3', name: 'Vegan Bowl', price: '$14', baseWaitTime: 5 },
        { id: 'f4', name: 'Cold Brew Coffee', price: '$4', baseWaitTime: 2 }
    ],
    
    // Simulation state
    simulation: {
        time: new Date(),
        locations: {
            'Food Court': { capacity: 80, trend: 1 },
            'Gate A': { capacity: 20, trend: -1 },
            'Gate C': { capacity: 10, trend: 0 },
            'Restrooms (L2)': { capacity: 45, trend: 1 }
        }
    },
    
    timerInterval: null,
    simInterval: null,
    
    init() {
        this.setupNavigation();
        this.startSimulation();
        this.setupDynamicInsights();
        this.renderFoodMenu();
    },
    
    // Simulation Engine
    startSimulation() {
        this.updateCrowdUI(); // Initial render
        
        // Run every 5 seconds to simulate real-time crowd dynamics
        this.simInterval = setInterval(() => {
            // Advance fake time by 5 minutes per tick for dramatic effect
            this.simulation.time.setMinutes(this.simulation.time.getMinutes() + 5);
            
            Object.keys(this.simulation.locations).forEach(loc => {
                const data = this.simulation.locations[loc];
                // Add some random noise and follow a trend
                let change = Math.floor(Math.random() * 5); 
                if (Math.random() > 0.7) data.trend *= -1; // Randomly flip trend
                
                data.capacity += change * data.trend;
                
                // Keep within 5-98%
                if (data.capacity > 98) { data.capacity = 98; data.trend = -1; }
                if (data.capacity < 5) { data.capacity = 5; data.trend = 1; }
            });
            
            this.updateCrowdUI();
            this.renderFoodMenu(); // update wait times
        }, 5000);
    },
    
    getDynamicWaitTime(baseWait) {
        // Wait time increases based on Food Court capacity
        const crowdFactor = this.simulation.locations['Food Court'].capacity / 100;
        return Math.floor(baseWait + (baseWait * crowdFactor * 1.5));
    },
    
    updateCrowdUI() {
        const grid = document.getElementById('crowd-stats-grid');
        if(!grid) return;
        
        let html = '';
        Object.keys(this.simulation.locations).forEach(loc => {
            const data = this.simulation.locations[loc];
            let status = 'Low';
            let statusClass = 'status-low';
            let textClass = 'text-green';
            let icon = 'ph-trend-down';
            let desc = 'Optimal';
            
            if (data.capacity > 75) {
                status = 'High';
                statusClass = 'status-high';
                textClass = 'text-red';
                icon = 'ph-trend-up';
                desc = 'Busy';
            } else if (data.capacity > 40) {
                status = 'Medium';
                statusClass = 'status-medium';
                textClass = 'text-yellow';
                icon = 'ph-minus';
                desc = 'Moderate';
            }
            
            html += `
                <div class="stat-box ${statusClass}">
                    <div class="stat-header">
                        <span>${loc}</span>
                        <i class="ph-fill ${icon} ${textClass}"></i>
                    </div>
                    <div class="stat-value">${status}</div>
                    <div class="stat-desc">${data.capacity}% capacity</div>
                </div>
            `;
        });
        
        grid.innerHTML = html;
        
        // Update Alert
        const alertBox = document.getElementById('dynamic-alert');
        if (alertBox) {
            const foodCap = this.simulation.locations['Food Court'].capacity;
            if (foodCap > 80) {
                alertBox.innerHTML = `<i class="ph-fill ph-warning-circle text-red"></i><span>Peak congestion detected at Food Court. Consider alternative dining areas.</span>`;
                alertBox.classList.remove('hidden');
            } else {
                alertBox.classList.add('hidden');
            }
        }
    },
    
    // UI Navigation
    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = item.getAttribute('data-target');
                
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
                
                document.querySelectorAll('.view').forEach(view => {
                    view.classList.remove('active');
                });
                document.getElementById(targetId).classList.add('active');
            });
        });
        
        document.getElementById('nav-search').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.setDestination(e.target.value);
            }
        });
    },
    
    // Home View Logic
    setupDynamicInsights() {
        const insightEl = document.getElementById('dynamic-insight');
        
        setInterval(() => {
            const gates = ['Gate A', 'Gate C'];
            const bestGate = gates.reduce((a, b) => this.simulation.locations[a].capacity < this.simulation.locations[b].capacity ? a : b);
            const foodCap = this.simulation.locations['Food Court'].capacity;
            
            const insights = [
                `${bestGate} is currently the fastest entry point (${this.simulation.locations[bestGate].capacity}% capacity).`,
                foodCap > 70 ? `Food Court is busy. Order via the app to skip the ${Math.floor(foodCap/3)} min queue.` : `Food Court is relaxed right now. Good time to grab a bite.`,
                `Temperature is optimal inside. Restrooms at Level 2 are clean and available.`
            ];
            
            const index = Math.floor(Math.random() * insights.length);
            
            insightEl.style.opacity = 0;
            setTimeout(() => {
                insightEl.innerText = insights[index];
                insightEl.style.opacity = 1;
            }, 300);
        }, 6000);
    },
    
    // Navigation View Logic
    setDestination(dest) {
        if (!dest) return;
        document.getElementById('nav-search').value = dest;
        
        const instructions = document.getElementById('route-instructions');
        const gateRec = document.getElementById('gate-recommendation');
        
        // Show loading state
        instructions.innerHTML = `<div class="loader"></div><p class="mt-2">Calculating optimal route to <strong class="text-cyan">${dest}</strong>...</p>`;
        gateRec.classList.add('hidden');
        
        setTimeout(() => {
            // Use simulation data to recommend best gate if applicable
            let bestGateText = '';
            if (dest.toLowerCase().includes('gate') || dest.toLowerCase().includes('seat')) {
                const bestGate = this.simulation.locations['Gate A'].capacity < this.simulation.locations['Gate C'].capacity ? 'Gate A' : 'Gate C';
                bestGateText = `Route updated to avoid crowds.`;
                gateRec.innerHTML = `
                    <div class="flex-row">
                        <i class="ph-fill ph-lightbulb text-yellow"></i>
                        <div>
                            <strong>Smart Reroute to ${bestGate}</strong>
                            <p>${bestGate} is currently optimal. ${bestGateText}</p>
                        </div>
                    </div>
                `;
                gateRec.classList.remove('hidden');
            }
            
            instructions.innerHTML = `
                <i class="ph-fill ph-check-circle icon-large text-green mb-2" style="animation: scaleIn 0.3s ease-out;"></i><br>
                Route found to <strong class="text-cyan">${dest}</strong>.<br>
                Estimated walking time: ${Math.floor(Math.random() * 5 + 2)} mins.
            `;
        }, 1500); // Simulated network delay
    },
    
    // Food System Logic
    renderFoodMenu() {
        const container = document.getElementById('food-menu');
        if(document.getElementById('food-token-view').classList.contains('hidden') === false) return; // Don't re-render if in token view
        
        container.innerHTML = this.foodMenu.map(item => {
            const dynamicWait = this.getDynamicWaitTime(item.baseWaitTime);
            let waitColor = 'text-green';
            if(dynamicWait > 15) waitColor = 'text-yellow';
            if(dynamicWait > 25) waitColor = 'text-red';
            
            return `
            <div class="food-item-card">
                <div class="food-info">
                    <h3>${item.name}</h3>
                    <div class="food-meta ${waitColor}"><i class="ph-fill ph-clock"></i> ~${dynamicWait} mins</div>
                    <div class="price-tag mt-2">${item.price}</div>
                </div>
                <button class="btn btn-outline" onclick="app.orderFood('${item.id}', ${dynamicWait})">Order</button>
            </div>
        `}).join('');
    },
    
    orderFood(id, waitTime) {
        const container = document.getElementById('food-menu');
        container.innerHTML = `<div class="loader-container w-full" style="grid-column: span 2; display: flex; justify-content: center; padding: 3rem;"><div class="loader"></div></div>`;
        
        setTimeout(() => {
            document.getElementById('food-menu').classList.add('hidden');
            document.getElementById('food-token-view').classList.remove('hidden');
            
            const token = String.fromCharCode(65 + Math.floor(Math.random() * 5)) + '-' + Math.floor(100 + Math.random() * 900);
            document.getElementById('token-number').innerText = token;
            
            this.startTimer(waitTime * 60);
        }, 1200);
    },
    
    cancelOrder() {
        clearInterval(this.timerInterval);
        document.getElementById('food-token-view').classList.add('hidden');
        document.getElementById('food-menu').classList.remove('hidden');
        this.renderFoodMenu();
    },
    
    startTimer(seconds) {
        clearInterval(this.timerInterval);
        const timerEl = document.getElementById('wait-timer');
        
        let remaining = seconds;
        this.timerInterval = setInterval(() => {
            if (remaining <= 0) {
                clearInterval(this.timerInterval);
                timerEl.innerText = "Ready!";
                return;
            }
            const m = Math.floor(remaining / 60);
            const s = remaining % 60;
            timerEl.innerText = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
            remaining--;
        }, 1000);
    },
    
    // Facilities Logic
    findFacility(type) {
        const resultCard = document.getElementById('facility-result');
        const titleEl = document.getElementById('facility-title');
        const descEl = document.getElementById('facility-desc');
        const timeEl = document.getElementById('facility-time');
        
        resultCard.classList.remove('hidden');
        resultCard.innerHTML = `<div class="card-body text-center"><div class="loader mx-auto mb-4"></div><p>Locating nearest ${type}...</p></div>`;
        
        setTimeout(() => {
            // Restore HTML structure
            resultCard.innerHTML = `
                <div class="card-body text-center" style="animation: fadeIn 0.3s ease-out;">
                    <div class="result-icon-lg mb-4">
                        <i class="ph-fill ph-map-pin"></i>
                    </div>
                    <h2 id="facility-title">Nearest ${type}</h2>
                    <p id="facility-desc" class="text-large mt-2">Location details</p>
                    
                    <div class="eta-badge mt-4">
                        <i class="ph ph-person-simple-walk"></i>
                        <span id="facility-time">-- mins away</span>
                    </div>
                    
                    <button class="btn btn-primary btn-large w-full mt-4" onclick="app.navigateToFacility('${type}')">
                        Start Navigation
                    </button>
                </div>
            `;
            
            const newDescEl = document.getElementById('facility-desc');
            const newTimeEl = document.getElementById('facility-time');
            
            if(type === 'Washroom') {
                newDescEl.innerText = "Level 2, North Wing";
                newTimeEl.innerText = "2 mins away";
            } else if (type === 'Exit') {
                newDescEl.innerText = "Gate A (Main Exit)";
                newTimeEl.innerText = "5 mins away";
            } else if (type === 'Medical') {
                newDescEl.innerText = "Ground Floor, Sector 3";
                newTimeEl.innerText = "1 min away";
            } else {
                newDescEl.innerText = "Main Atrium";
                newTimeEl.innerText = "3 mins away";
            }
        }, 1000);
    },
    
    navigateToFacility(type) {
        const navTarget = document.querySelector('[data-target="view-nav"]');
        navTarget.click();
        this.setDestination(type);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
