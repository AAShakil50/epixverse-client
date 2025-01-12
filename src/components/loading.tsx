import { IconLoader } from "@tabler/icons-react";

const LoadingComponent = () => {
    return <center className={`flex m-auto`}>
        <IconLoader size={48} />
        <div className={`text-2xl`}>Loading ...</div>
    </center>;
};

export default LoadingComponent;