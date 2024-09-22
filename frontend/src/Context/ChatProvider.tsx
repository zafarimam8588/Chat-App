import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

interface ChatContextType {
  selectedChat?: any;
  setSelectedChat: React.Dispatch<React.SetStateAction<any>>;
  user?: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;

  chats?: any;
  setChats: React.Dispatch<React.SetStateAction<any>>;
}

// Create the context with an initial value of undefined
const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

const ChatProvider: React.FC<ChatProviderProps> = ({ children }: any) => {
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState();
  // const [notification, setNotification] = useState([]);

  const [chats, setChats] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    const userInfo = storedUser ? JSON.parse(storedUser) : null;

    if (!userInfo) {
      navigate("/");
    } else {
      setUser(userInfo);
    }
  }, [navigate]);

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        chats,
        setChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("ChatState must be used within a ChatProvider");
  }
  return context;
};

export default ChatProvider;
