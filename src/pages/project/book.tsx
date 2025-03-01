import { SectionTable } from "../project";

const ProjectBook = () => {
  return (
    <SectionTable
      caption="List of Chapters"
      headings={["Title", "Description", "Items"]}
      rows={[]}
    />
  );
};

export default ProjectBook;
