import { FaGithub } from "react-icons/fa";
const Footer = () => {
    return (
      <footer className="fixed bottom-0 left-0 w-full h-[40px] bg-black text-white py-4 px-6 flex items-center justify-center text-md font-semibold">
        <div className="flex items-center">
        <FaGithub onClick={() => { window.location.href = 'https://github.com/YashwantBhosale/CodeVault'; }} className="m-3"/>
          <a href="https://github.com/YashwantBhosale/CodeVault" target="_blank" rel="noopener noreferrer">
            
            Made by Yashwant and Mehmood
          </a>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  