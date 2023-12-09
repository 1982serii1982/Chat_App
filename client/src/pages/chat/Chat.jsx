import React from "react";
import { Link } from "react-router-dom";
import fileDownload from "js-file-download";
import { UserContext } from "../../context/UserContext";

import Avatar from "../../components/Avatar";
import ChatLogo from "../../components/ChatLogo";
import Burger from "../../components/Burger";
import axiosM from "./../../utils/axiosM";

const Chat = () => {
  const { userEmail, userId } = React.useContext(UserContext);
  const [ws, setWs] = React.useState(null);
  const [onlinePeople, setOnlinePeople] = React.useState([]);
  const [selectedContact, setSelectedContact] = React.useState(null);
  const [selectedContactEmail, setSelectedContactEmail] = React.useState(null);
  const [textMessage, setTextMessage] = React.useState("");
  const [messages, setMessages] = React.useState([]);
  const [fileData, setFileData] = React.useState(null);
  const [filePreview, setFilePreview] = React.useState(null);

  const divRef = React.useRef(null);
  const inputFileRef = React.useRef(null);

  const showOnlinePeople = (peopleArray) => {
    const people = {};

    peopleArray["all"].forEach(({ _id, email }) => {
      if (peopleArray["online"].every((item) => item.userId !== _id)) {
        people[_id] = { online: false, email: email };
      } else {
        people[_id] = { online: true, email: email };
      }
    });

    setOnlinePeople(people);
  };

  const handleMessage = (e) => {
    const messageData = JSON.parse(e.data);

    if ("all" in messageData) {
      showOnlinePeople(messageData);
    }
  };

  const sendMessage = (e, file = null) => {
    if (e) {
      e.preventDefault();
    }

    if (textMessage.length === 0 && file) {
      ws.send(
        JSON.stringify({
          destEmail: selectedContactEmail,
          destId: selectedContact,
          text: "",
          file,
        })
      );

      setMessages((prev) => [
        ...prev,
        {
          text: "",
          receiver: selectedContact,
          sender: userId,
          fileURL: filePreview,
        },
      ]);
    }

    if (textMessage.length !== 0) {
      ws.send(
        JSON.stringify({
          destEmail: selectedContactEmail,
          destId: selectedContact,
          text: textMessage,
          file: "",
        })
      );

      setMessages((prev) => [
        ...prev,
        {
          text: textMessage,
          receiver: selectedContact,
          sender: userId,
          fileURL: "",
        },
      ]);
      setTextMessage("");
    }
  };

  const connectToWs = () => {
    const webSocket = new WebSocket(import.meta.env.VITE_WS_API_URL);

    setWs(webSocket);

    webSocket.addEventListener("message", handleMessage);

    webSocket.addEventListener("close", (e) => {
      if (e.code !== 3333) {
        setTimeout(() => {
          console.log("Disconnected. Trying to reconnect.");
          connectToWs();
        }, 1000);
      }
    });

    webSocket.addEventListener("open", () => {
      setTimeout(() => {
        console.log("Connection established");
      }, 1000);
    });
  };

  const attachFileHandler = (e) => {
    setTextMessage("");
    setFileData(e.target.files[0]);
  };

  const handleSelectedContact = (id, email) => {
    setSelectedContact(id);
    setSelectedContactEmail(email);
  };

  const handleCancelPreview = () => {
    inputFileRef.current.value = null; // pentru a avea posibilitatea de a face upload la alta imagine in caz ca am anulat prcedenta
    setFileData(null);
  };

  const handleSendPreview = () => {
    if (fileData) {
      const reader = new FileReader();
      reader.readAsDataURL(fileData);

      reader.onload = function () {
        sendMessage(null, {
          info: {
            name: fileData.name,
            size: fileData.size,
            type: fileData.type,
          },
          data: reader.result,
        });
      };
    }

    setFilePreview(null);
  };

  const handleDownload = async (url, filename) => {
    const { data } = await axiosM.get(url, {
      responseType: "blob",
    });

    fileDownload(data, filename);
  };

  React.useEffect(() => {
    connectToWs();
  }, []);

  React.useEffect(() => {
    divRef.current.scrollIntoView(false, { behavior: "instant" });
  }, [messages]);

  React.useEffect(() => {
    const getMessages = async () => {
      try {
        if (selectedContact) {
          const { data } = await axiosM.get(
            `api/message/all/${selectedContact}`
          );

          setMessages(data);
        }
      } catch (error) {}
    };

    getMessages();
  }, [selectedContact]);

  React.useEffect(() => {
    if (!fileData) {
      setFilePreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(fileData);
    setFilePreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [fileData]);

  return (
    <div className="flex h-screen">
      <div className="bg-blue-100 w-1/3 px-4 pt-4">
        <div className="flex justify-between items-center mb-4">
          <ChatLogo />
          <div className="flex justify-between gap-3">
            <div>{userEmail}</div>
            <Burger ws={ws} />
          </div>
        </div>
        {Object.keys(onlinePeople).map((item) => {
          if (item !== userId) {
            return (
              <div
                key={item}
                className={
                  "border-b border-gray-100 gap-4 flex items-center cursor-pointer " +
                  (selectedContact === item ? "bg-blue-200" : "")
                }
                onClick={() =>
                  handleSelectedContact(item, onlinePeople[item].email)
                }
              >
                {selectedContact === item ? (
                  <div className="w-1 bg-blue-900 h-10"></div>
                ) : (
                  <div className="w-1 bg-transparent h-10"></div>
                )}
                <div className="py-2 flex gap-2 items-center">
                  <Avatar
                    userEmail={onlinePeople[item]["email"]}
                    userId={item}
                    online={onlinePeople[item]["online"]}
                  />
                  <span>{onlinePeople[item]["email"]}</span>
                </div>
              </div>
            );
          }
        })}
      </div>
      <div className="bg-blue-300 w-2/3 flex flex-col">
        <div className="grow p-4 overflow-y-scroll relative">
          {!selectedContact && (
            <div className="flex h-full flex-grow items-center justify-center">
              <div className="text-gray-600">Select a person</div>
            </div>
          )}
          {!!selectedContact && (
            <div className="flex flex-col">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={
                    (msg.sender === userId ? "self-end" : "self-start") +
                    " flex justify-center items-baseline gap-2"
                  }
                >
                  {msg.fileURL && (
                    <div className="w-80 bg-white border-blue-500 border-2 p-1 mt-1 flex flex-col gap-2">
                      <img
                        className="object-cover"
                        src={
                          msg.fileURL.split(":")[0] === "blob"
                            ? msg.fileURL
                            : `http://localhost:4441/${msg.fileURL}`
                        }
                        alt="Image sent"
                      />
                      {msg.fileURL.split(":")[0] === "blob" ? (
                        <Link
                          to={msg.fileURL}
                          target="_blank"
                          download
                          className="w-full bg-blue-500 text-white p-1 text-center"
                        >
                          Download Image
                        </Link>
                      ) : (
                        <button
                          className="w-full bg-blue-500 text-white p-1 text-center"
                          onClick={() => {
                            handleDownload(msg.fileURL, "image.jpg");
                          }}
                        >
                          Download Image
                        </button>
                      )}
                    </div>
                  )}

                  {msg.text.length > 0 && (
                    <div
                      className={
                        "p-2 text-white rounded-tl-2xl rounded-br-2xl mb-2 " +
                        (msg.sender === userId
                          ? "bg-violet-500"
                          : "bg-green-500 order-first")
                      }
                    >
                      {msg.text}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {filePreview && (
            <div className="w-80 bg-white border-blue-500 border-2  absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-1 flex flex-col gap-2">
              <div>
                <img
                  className="object-cover"
                  src={filePreview}
                  alt="Image preview"
                />
              </div>
              <div className="flex gap-2 text-white">
                <button
                  className="grow bg-blue-300 rounded"
                  onClick={() => handleCancelPreview()}
                >
                  Cancel
                </button>
                <button
                  className="grow bg-blue-300 rounded"
                  onClick={() => handleSendPreview()}
                >
                  Send
                </button>
              </div>
            </div>
          )}
          <div ref={divRef}></div>
        </div>
        <form className="flex gap-2 p-2" onSubmit={sendMessage}>
          {selectedContact && (
            <>
              <input
                value={textMessage}
                onChange={(e) => setTextMessage(e.target.value)}
                type="text"
                placeholder="Type your message here"
                className="bg-white border p-2 grow outline-none rounded"
              />
              <label className="bg-blue-500 p-2 text-white rounded cursor-pointer">
                <input
                  ref={inputFileRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => attachFileHandler(e)}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
                  />
                </svg>
              </label>
              <button
                className="bg-blue-500 p-2 text-white rounded"
                type="submit"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                  />
                </svg>
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default Chat;
