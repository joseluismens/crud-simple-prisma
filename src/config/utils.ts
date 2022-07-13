
import bcrypt from 'bcrypt';

export default class Utils{


   static checkIfUnencryptedPasswordIsValid(unencryptedPassword: string,password:string) {
        return bcrypt.compareSync(unencryptedPassword, password);
    }
    static hashPassword(password:string){
        return bcrypt.hashSync(password,8);
    }

}



