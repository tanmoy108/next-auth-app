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
      console.log("user: ",user)
      console.log("account: ",account)
      console.log("profile: ",profile)
      console.log("email: ",email)
      console.log("credentials: ",credentials)
      try {
        const userEmail = user.email;

        if(!userEmail) return false
        const existingUser = await users.findOne({ email: user.email });          
        if (existingUser) return true;
        await users.create({name: user.name, email: userEmail,pending:false,medium:account.provider})
        return true;
      } catch (error) {
        console.log("errorrr:", error);
        return false;
      }
    },

    async jwt({ token, user, account, profile, isNewUser }) {
      console.log("token22",token)
      console.log("user22",user)
      console.log("account22: ",account)
      console.log("profile22: ",profile)
      console.log("isNewUser22: ",isNewUser)
      if(user){
        user.role = user?.role == null ? "users": user?.role
        token.user = user
      }
      console.log("token update: ",token)
      return token
    },
    async session({ session, user, token }) {
      console.log("session33",session)
      console.log("user33",user)
      console.log("token33",token)
      
      session.user = token.user
      return session
    }
 
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
