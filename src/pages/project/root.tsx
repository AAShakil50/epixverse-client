import { SectionTable } from "../project";

const ProjectIndex = () => {
  return (
    <SectionTable
      caption="List of Books"
      headings={["Title", "Description", "Items"]}
      rows={[
        ["nfwoie", "foi", "noerf"],
        ["hferf", "fierf", "foerif"],
      ]}
    />
  );
};

export default ProjectIndex;
