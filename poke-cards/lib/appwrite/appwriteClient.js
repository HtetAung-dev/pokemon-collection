import { Account, Avatars, Client, Databases, ID, Query } from 'react-native-appwrite';
import { store } from '../../redux/store';
import { login, logout } from '../../redux/authSlice';
export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.louis.pokecards',
    projectId: '66e94f730016aee80e52',
    databaseId: '66e94f91002495d7c200',
    userCollectionId: '66e95048000a2524cd55',
    cardCollectionId: '66e9505a0006338adf27'
}

// Init your react-native SDK
const client = new Client();

client.setEndpoint(config.endpoint).setProject(config.projectId).setPlatform(config.platform);
const account = new Account(client);
const avaters = new Avatars(client);
const databases = new Databases(client);

// user create api
export const registerUser = async (username, email, password) => {
    try {
        console.log(email)
        const newAccount = await account.create(
            ID.unique(), 
            email,
            password, 
            username            
        );
        if(!newAccount) throw Error;             
        store.dispatch(login(newAccount));
        
        await signIn(email, password);
        const avaterUrl = avaters.getInitials(username);
        const newUser = await databases.createDocument(
            config.databaseId,
            config.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email: email,
                username: username,
                password: password,
                avater: avaterUrl
            }
        )
        return newUser;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

export const signIn = async(email, password) => {
    try {
        const session = await account.createEmailPasswordSession(email,password);
    
        return session;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

export async function getAccount() {
    try {
      const currentAccount = await account.get();
  
      return currentAccount;
    } catch (error) {
      throw new Error(error);
    }
  }

export async function getCurrentUser() {
    try {
      const currentAccount = await getAccount();
      if (!currentAccount) throw Error;
  
      const currentUser = await databases.listDocuments(
        config.databaseId,
        config.userCollectionId,
        [Query.equal("accountId", currentAccount.$id)]
      );
  
      if (!currentUser) throw Error;
  
      return currentUser.documents[0];
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  
  // Sign Out
  export async function signOut() {
    try {
      const session = await account.deleteSession("current");
      store.dispatch(logout());
      return session;
    } catch (error) {
      throw new Error(error);
    }
  }