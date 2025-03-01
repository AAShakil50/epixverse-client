import { SectionTable } from "../project";

const ProjectBook = () => {
  return (
    <SectionTable
      caption="List of Chapters"
      headings={["Title", "Description", "Items"]}
      rows={[
        ["nfwoie", "foi", "noerf"],
        ["hferf", "fierf", "foerif"],
      ]}
    />
  );
};

export default ProjectBook;
