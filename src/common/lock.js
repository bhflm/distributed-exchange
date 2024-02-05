class Lock {
  constructor() {
    this.isLocked = false;
  }
  
  async acquire() {
    return new Promise((resolve) => {
      const waitForUnlock = () => {
        if (!this.isLocked) {
          this.isLocked = true;
          resolve();
        } else {
          setTimeout(waitForUnlock, 10);
        }
      };

      waitForUnlock();
    });
  }

  // Release the lock
  release() {
    this.isLocked = false;
  }
}

module.exports = {
  Lock,
};