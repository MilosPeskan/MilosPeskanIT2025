import { ROLE_REVEAL_TIMER } from "../constants.js";

export class HoldButton {
    constructor(button, holdTime = ROLE_REVEAL_TIMER) {
        this.button = button;
        this.holdTime = holdTime;
        
        this.isHolding = false;
        this.startTime = null;
        this.holdTimer = null;
        this.progressInterval = null;
        
        this.onComplete = null;
        this.onProgress = null;
        
        this.attachEventListeners();
    }

    attachEventListeners() {
        this.button.addEventListener('mousedown', (e) => {
            this.startHold(e);
        });
    
        this.button.addEventListener('mouseup', () => {
            this.cancelHold();
        });
        
        this.button.addEventListener('mouseleave', () => {
            this.cancelHold();
        });

        // Touch events
        this.button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.startHold(e);
        });
        
        this.button.addEventListener('touchend', () => {
            this.cancelHold();
        });
        
        this.button.addEventListener('touchcancel', () => {
            this.cancelHold();
        });
    }

    startHold(event) {
        if (this.isHolding) return; // Već drži
        
        this.isHolding = true;
        this.button.classList.add("holding");
        this.startTime = Date.now();
        
        // Progress callback svakih 50ms
        this.progressInterval = setInterval(() => {
            const elapsed = Date.now() - this.startTime;
            const progress = Math.min((elapsed / this.holdTime) * 100, 100);
            
            if (this.onProgress) {
                this.onProgress(progress);
            }
        }, 50);

        // Timer za završetak
        this.holdTimer = setTimeout(() => {
            this.completeHold();
        }, this.holdTime);
    }

    cancelHold() {
        if (!this.isHolding) return;
                
        this.isHolding = false;
        this.button.classList.remove("holding");
        
        // Očisti timere
        if (this.holdTimer) {
            clearTimeout(this.holdTimer);
            this.holdTimer = null;
        }
        
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }

        // Reset progress
        if (this.onProgress) {
            this.onProgress(0);
        }
    }

    completeHold() {
        this.isHolding = false;
        this.button.classList.remove("holding");
        
        // Očisti interval
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }

        // Pozovi callback
        if (this.onComplete) {
            this.onComplete();
        }
    }

    destroy() {
        this.cancelHold();
        // Cleanup event listeners ako treba
    }
}