import { Loader } from "lucide-react";

const LoadingComponent = () => {
    return <center className={`flex m-auto`}>
        <Loader size={48} />
        <div className={`text-2xl`}>Loading ...</div>
    </center>;
};

export default LoadingComponent;