export default class Config {
    public static apiUrl:string = "" //fetch API url 
    //public static apiUrl:string = "http://localhost:3000"
    public static registerUrl: string = `${this.apiUrl}/auth/signup`
    public static LoginUrl: string = `${this.apiUrl}/auth/signin`
    public static resetPasswordUrl: string = `${this.apiUrl}/auth/reset-password`
    public static resetPasswordConfirmationUrl: string = `${this.apiUrl}/auth/reset-password-confirmation`
    public static deleteUrl: string = `${this.apiUrl}/auth/delete`
}
