export class User {
  private name: string;
  private email: string;
  private password: string;
  private profilePicture: File | null;

  constructor(
    name: string,
    email: string,
    password: string,
    profilePicture: File | null = null
  ) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.profilePicture = profilePicture;
  }
}
