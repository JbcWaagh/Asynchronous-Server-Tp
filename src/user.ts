export class User {
    public username: string
    public email: string
    private password: string = ""
  
    constructor(username: string, email: string, password: string, passwordHashed: boolean = false) {
      this.username = username
      this.email = email
  
      if (!passwordHashed) {
        this.setPassword(password)
      } else this.password = password
    }
    static fromDb(username: string, value: any): User {
        const [password, email] = value.split(":")
        return new User(username, email, password)
      }
    
      public setPassword(toSet: string): void {
        // Hash and set password
      }
    
      public getPassword(): string {
        return this.password
      }
    
      public validatePassword(toValidate: String): boolean {
        // return comparison with hashed password
      }
    }