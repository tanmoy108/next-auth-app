import { connect } from "@/utils/dbConfig";
import { users } from "@/utils/model/users";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

connect();
export const authOptions = {
  pages: {
    signIn: "/",
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log(user)
      console.log(account)
      console.log(profile)
      console.log(email)
      console.log(credentials)
      try {
        const userEmail = profile.email || user.email;

        if(!userEmail) return false
        const existingUser = await users.findOne({ email: user.email });          
        if (existingUser) return true;
        await users.create({name: user.name, email: userEmail,pending:false})
        return true;
      } catch (error) {
        console.log("errorrr:", error);
        return false;
      }
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Enter mail" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const user = await users.findOne({ email: credentials.email });

        if (user) {
          return user;
        } else {
          return null;
        }
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      scope: ["read:user", "user:email"],
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
};
