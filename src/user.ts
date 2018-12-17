import { LevelDb } from "./leveldb"
import WriteStream from 'level-ws'
import bcrypt from 'bcrypt';

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

  static fromDb(data:any): User {
    const[email,password]=data.value.split(':')
    const[,username]=data.key.split(':')
    return new User(username, email, password,true)
}

  public setPassword(toSet: string): void {
    const hash = bcrypt.hashSync(toSet, 10) // on hash le pswd du l'utilisateur avant de le stocker
    this.password = hash
  }

  public getPassword(): string {
    return this.password
  }

  public validatePassword(toValidate: String): boolean {
    if (bcrypt.compareSync(toValidate, this.password)) {
      return true
    } else {
      return false
    }
  }
}


export class UserHandler {
  public db: any

  
  public get(username: string, callback: (err: Error | null, result?: User) => void) {
    const stream = this.db.createReadStream()
    var user: User

    stream
      .on("error", (err: Error) => {
        callback(err)
      })
      .on("end", () => {
        callback(null, user)
      })
      .on("data", (data: any) => {
        const [, key2] = data.key.split(":")
        if (username === key2) {
          user = User.fromDb(data)
        }

      })
  }


  public save(user: User, callback: (err: Error | null) => void) {
    console.log("save")

    this.db.put(`user:${user.username}`, `${user.email}:${user.getPassword()}`, (err: Error | null) => {
      if (err)
        callback(err)
      else
        callback(null)
    })
  }


  constructor(path: string) {
    this.db = LevelDb.open(path)
  }
}