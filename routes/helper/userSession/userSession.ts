interface UserDataInput {
  id: Number,
  Name: string,
  email?: string | null | undefined,
  phone?: string | null | undefined,
}
interface UserData extends UserDataInput {
  createTime: Date
}
class UserSessionManager {
  private users: { [key: string]: UserData };

  constructor() {
    this.users = {};
    setInterval(this.infLoopSessionKiller,60000);
  }

  private async infLoopSessionKiller() {
    console.log("check to kill")
    const deleteFlag: string[] = [];
    if(!this.users){
      return;
    }
    Object.entries(this.users).forEach(([key, value]) => {
      const hours = Math.abs((new Date()).getTime() - value.createTime.getTime()) / 36e5;
      if (hours >= 10) {
        deleteFlag.push(key);
      }
    });
    deleteFlag.forEach((deleteKey) => {
      this.reomoveUser(deleteKey);
    });
  }

  addUser(sid: string, userData: UserDataInput) {
    if (this.isLogged(sid)) {
      return false;
    }
    this.users[sid] = {
      ...userData,
      createTime: new Date()
    };
    return true;
  }
  reomoveUser(sid: string) {
    if (!this.isLogged(sid)) {
      return false;
    }
    delete this.users[sid];
    return true
  }
  isLogged(sid: string) {
    return this.users.hasOwnProperty(sid)
  }
  checkAndRefreshed(sid:string){
    if(this.isLogged(sid)){
      this.users[sid].createTime = new Date();
      return true
    }
    return false;
  }
}

export default UserSessionManager;