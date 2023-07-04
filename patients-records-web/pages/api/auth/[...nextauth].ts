/** @format */

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";

const socialLoginFlow = async (
  provider: string,
  access_token: string,
  user_id: string,
  username: string,
  email: string,
  pictureUrl: string
) => {
  try {
    var formBody = [];
    formBody.push(
      encodeURIComponent("grant_type") + "=" + encodeURIComponent(provider)
    );
    formBody.push(
      encodeURIComponent("access_token") +
        "=" +
        encodeURIComponent(access_token)
    );
    formBody.push(
      encodeURIComponent("client_id") +
        "=" +
        encodeURIComponent(`social_${provider}`)
    );
    formBody.push(
      encodeURIComponent("client_secret") +
        "=" +
        encodeURIComponent(`social_${provider}`)
    );
    formBody.push(
      encodeURIComponent("user_id") + "=" + encodeURIComponent(user_id)
    );
    formBody.push(
      encodeURIComponent("username") + "=" + encodeURIComponent(username)
    );
    formBody.push(
      encodeURIComponent("email") + "=" + encodeURIComponent(email)
    );
    formBody.push(
      encodeURIComponent("pictureUrl") + "=" + encodeURIComponent(pictureUrl)
    );
    const formBodyString = formBody.join("&");
    const response = await fetch("http://localhost:3005/token", {
      method: "post",
      body: formBodyString,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      return {
        id: data.email,
        email: data.email,
        name: data.username,
        accessToken: data.access_token,
        userCreationCompleted: data.userCreationCompleted,
        userPlanId: data.userPlanId,
        paymentOk: data.paymentOk,
        companyName: data.companyName,
      };
    } else {
      throw new Error("Error while authenticating...");
    }
  } catch (error: any) {
    console.log("An unexpected error occurred while creating user: ", error);
    throw new Error("Error while authenticating...");
  }
};

export default NextAuth({
  pages: {
    signIn: "/entrar",
  },
  session: {
    strategy: "jwt",
  },
  secret: "secret",
  providers: [
    CredentialsProvider({
      name: "Sign in",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }
        try {
          var formBody = [];
          formBody.push(
            encodeURIComponent("client_id") +
              "=" +
              encodeURIComponent("web_professionals")
          );
          formBody.push(
            encodeURIComponent("client_secret") +
              "=" +
              encodeURIComponent("web_professionals")
          );
          formBody.push(
            encodeURIComponent("grant_type") +
              "=" +
              encodeURIComponent("password")
          );
          formBody.push(
            encodeURIComponent("scope") + "=" + encodeURIComponent("openid")
          );
          formBody.push(
            encodeURIComponent("usernameEmail") +
              "=" +
              encodeURIComponent(credentials?.email)
          );
          formBody.push(
            encodeURIComponent("password") +
              "=" +
              encodeURIComponent(credentials?.password)
          );
          formBody.push(
            encodeURIComponent("resource") +
              "=" +
              encodeURIComponent("http://localhost:3006")
          );
          const formBodyString = formBody.join("&");
          const response = await fetch("http://localhost:3005/token", {
            method: "post",
            body: formBodyString,
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Accept: "application/json",
            },
          });

          if (response.ok) {
            const data = await response.json();
            return {
              id: data.email,
              email: data.email,
              name: data.username,
              accessToken: data.access_token,
              userCreationCompleted: data.userCreationCompleted,
              userPlanId: data.userPlanId,
              paymentOk: data.paymentOk,
              companyName: data.companyName,
            };
          } else {
            return null;
          }
        } catch (error: any) {
          console.log(
            "An unexpected error occurred while creating user: ",
            error
          );
          return null;
        }
      },
    }),
    FacebookProvider({
      clientId: `592502122839259`,
      clientSecret: `d59fa3a4fe5100112930c4a974054359`,
    }),
    GoogleProvider({
      clientId:
        "898654580939-d3v52ladfrhb6mh3jfi6b41qql5red29.apps.googleusercontent.com",
      clientSecret: "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",
    }),
  ],
  callbacks: {
    async jwt({ token, trigger, user, session }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (trigger === "update" && session?.userCreationCompleted) {
        // Note, that `session` can be any arbitrary object, remember to validate it!
        if (token) token.userCreationCompleted = session;
      }

      if (user) {
        return { ...user };
      } else if (token.accessToken && token.email && token.name) {
        return { ...token };
      }
      if (token.user) {
        return { ...token.user };
      } else {
        return { token, user };
      }
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token and user id from a provider.
      if (token) {
        session.user = token;
      }
      return session;
    },
    async signIn({ user, account, profile, email, credentials }) {
      if (
        account?.provider &&
        (account?.provider === "facebook" || account?.provider === "google")
      ) {
        const response = await socialLoginFlow(
          account?.provider,
          account.access_token!,
          account.providerAccountId,
          user.email!,
          user.name!,
          user.image!
        );

        (<any>user).accessToken = response?.accessToken;
        (<any>user).userCreationCompleted = response?.userCreationCompleted;
        (<any>user).userPlanId = response?.userPlanId;
        (<any>user).paymentOk = response?.paymentOk;
        (<any>user).companyName = response?.companyName;
      }
      const isAllowedToSignIn = true;
      if (isAllowedToSignIn) {
        return true;
      } else {
        // Return false to display a default error message
        return false;
        // Or you can return a URL to redirect to:
        // return '/unauthorized'
      }
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
});
