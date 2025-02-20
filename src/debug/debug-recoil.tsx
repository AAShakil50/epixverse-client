import { useEffect } from "react";
import { useRecoilSnapshot } from "recoil";

const RecoilLogger = () => {
  const snapshot = useRecoilSnapshot();

  useEffect(() => {
    console.group(
      "%cRecoild Snapshot Updated / ",
      "color: purple",
      new Date().getSeconds(),
    );
    for (const node of snapshot.getNodes_UNSTABLE({ isModified: true })) {
      console.log(
        `%c${node.key}: %c${snapshot.getLoadable(node).contents}`,
        "color: cyan",
        "color: lightcoral",
      );
    }
    console.groupEnd();
  }, [snapshot]);

  return null;
};

export { RecoilLogger };
