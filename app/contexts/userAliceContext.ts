import {PushAPI} from "@pushprotocol/restapi";
import {PushStream} from "@pushprotocol/restapi/src/lib/pushstream/PushStream";
import {createContext, useContext} from "react";
interface User {
  userAlice: PushAPI;
  setUserAlice: (userAlice: PushAPI) => void;
  userStream: PushStream;
  setUserStream: (userStream: PushStream) => void;
}
const user: User = {
  userAlice: {} as PushAPI,
  setUserAlice: () => {},
  userStream: {} as PushStream,
  setUserStream: () => {},
};

export const UserContext = createContext(user);

export const useUserAlice = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserAlice must be used within a UserAliceProvider");
  }
  return context;
};
