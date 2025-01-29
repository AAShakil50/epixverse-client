import { useEffect } from "react";
import { useRecoilSnapshot } from "recoil";

const RecoilLogger = () => {
    const snapshot = useRecoilSnapshot();

    useEffect(() => {
        console.group("%cRecoild Snapshot Updated / ", 'color: purple' , new Date().getSeconds());
        for (const node of snapshot.getNodes_UNSTABLE({ isModified: true })) {
            console.log(node.key, snapshot.getLoadable(node));
        }
        console.groupEnd();
    }, [snapshot]);

    return null;
}

export { RecoilLogger };