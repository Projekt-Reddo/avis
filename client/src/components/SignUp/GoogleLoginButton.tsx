// import { GoogleLogin } from "react-google-login";
import IconBrand from "./IconBrand";

interface GoogleLoginButtonProps {
  googleResponse?: () => void;
}
const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  googleResponse,
}) => {
  const styles = { backgroundColor: "#fff" };
  var GOOGLE_CLIENT_ID = ":";

  return (<></>
    // <>
    //   <GoogleLogin
    //     clientId={GOOGLE_CLIENT_ID}
    //     buttonText="Google Login"
    //     render={(renderProps: any) => (
    //       <button
    //         className="rounded-full w-max border boxShadow"
    //         onClick={renderProps.onClick}
    //         style={styles}
    //       >
    //         {/* <div className="google-icon-wrapper rounded-full"> */}
    //         <IconBrand
    //           className="text-3xl p-1"
    //           icon={["fab", "google"]}
    //           style={{ color: "pink" }}
    //         ></IconBrand>
    //         {/* </div> */}
    //       </button>
    //     )}
    //     onSuccess={googleResponse}
    //     onFailure={googleResponse}
    //     style={styles}
    //   />
    // </>
  );
};

export default GoogleLoginButton;
