import { FunctionComponent, useState } from 'react';
import "@styles/components/modals/SignUpLoginModal.scss";

type SignUpLoginModalProps = {
    isOpen: boolean;
    closeModal: () => void;
    respondAndCloseModal: (data: any) => void;
}

const SignUpLoginModal: FunctionComponent<SignUpLoginModalProps> = (props: SignUpLoginModalProps) => {
    const [selectedTab, setSelectedTab] = useState<"SignUp" | "Login">("Login");
    
    return (
        <div className={'SignUpLoginModal'  + (props.isOpen ? " SignUpLoginModal-visible" : "")} onClick={
            (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => 
                {if(e.target === e.currentTarget)props.closeModal()}}>
            {selectedTab === "Login" ?
                (<div className="LoginModal">
                    <div className="LoginModal_container">
                        <h2>Welcome back to Muzik</h2>
                        <div className="LoginModal_container_body_input">
                            <label>email</label>
                            <input type="text" placeholder="Username or email" />
                            <label>password</label>
                            <input type="password" placeholder="Password" />
                        </div>
                        <h4>forgot your password? <span onClick={() => {}}>reset it here</span></h4>
                        <div className="LoginModal_container_body_button" onClick={() => props.respondAndCloseModal({})}>Login</div>
                        <h5>Don't have an account? <span onClick={() => setSelectedTab("SignUp")}>create an account</span></h5>
                    </div>
                </div>)
                :
                (<div className='SignUpModal'>
                    <div className="SignUpModal_container">
                        <h2>Welcome to Muzik</h2>
                        <h3>Sign up to share playlists with friends</h3>
                        <div className="SignUpModal_container_body_input">
                            <label>username</label>
                            <input type="text" placeholder="Username" />
                            <label>email</label>
                            <input type="text" placeholder="Email" />
                            <label>password</label>
                            <input type="password" placeholder="Password" />
                        </div>
                        <div className="SignUpModal_container_body_button" onClick={() => props.respondAndCloseModal({})}>Sign Up</div>
                        <h5>Already have an account? <span onClick={() => setSelectedTab("Login")}>login</span></h5>
                    </div>
                </div>)
            }
        </div>
    )
}

export default SignUpLoginModal