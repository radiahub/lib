
/*
 * Trivial class registry
 */
class registry {
    
    constructor () {
        this.classes = new Map();
    }    

    // Expect Class to have been declared
    // class Class { ... }
    //
    reg (Class) {
        let name = Class.name;
        //name = name.toLowerCase();
        console.info("in registry.reg(`'${name}'`)");
        if (!this.classes.has(name)) {
            this.classes.set(name, Class);
            return true;
        }
        return false;
    }

    create (name, ...args) {
        //name = name.toLowerCase();
        if (this.classes.has(name)) {
            const Class = this.classes.get(name);
            if (!Class) { return null; }
            return new Class(...args);
        }
        return null;
    }
        
    exists (name) {
        //name = name.toLowerCase();
        if (this.classes.has(name)) {
            const Class = this.classes.get(name);
            if (!Class) { return false; }
            return true;
        }
        return false;
    }
            
    delete (name) {
        //name = name.toLowerCase();
        if (this.classes.has(name)) {
            this.classes.delete(name);
        }            
    }     

}


/* End of files: registry.js */