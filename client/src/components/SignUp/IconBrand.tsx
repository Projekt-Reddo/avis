import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";

library.add(fab);

const IconBrand = (props: any) => {
  return <FontAwesomeIcon {...props} fixedWidth={true} />;
};

export default IconBrand;
