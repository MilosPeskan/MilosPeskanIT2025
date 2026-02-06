export class UiController{
    constructor(rootElement) {
        this.rootElement = rootElement;
    }

    show(displayType = "flex"){
        this.rootElement.style.display = displayType;
    }

    hide(){
        this.rootElement.style.display = "none";
    }

    isVisible(){
        return this.rootElement.style.display !== "none";
    }

    changeElementDisplayType(element, displayType){
        element.style.display = displayType;
    }

    addEventListener(element, event, handler){
        element.addEventListener(event, handler);
        if(!this.listeners) this.listeners = [];
        this.listeners.push({element, event, handler});
    }

    cleanup() {
        if(this.listeners) {
            this.listeners.forEach(({element, event, handler}) => {
                element.removeEventListener(event, handler);
            });
            this.listeners = [];
        }
    }

  /**
   * Čisti sve event listeners (pozovi kad uništavaš kontroler)
   */
  cleanup() {
    if (this.listeners) {
      this.listeners.forEach(({ element, event, handler }) => {
        element.removeEventListener(event, handler);
      });
      this.listeners = [];
    }
  }
}