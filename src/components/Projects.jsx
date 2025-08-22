// components/Projects.jsx
import ScrollFloat from "@/reactbits/TextAnimations/ScrollFloat/ScrollFloat";
import Folder from "@/reactbits/Components/Folder/Folder";
import CircularGallery from "@/reactbits/Components/CircularGallery/CircularGallery";

export default function Projects() {
  const projects = [
    { name: "Project One", img: "/covers/proj1.jpg", details: "GIS Analysis Project" },
    { name: "Project Two", img: "/covers/proj2.jpg", details: "Mapping with React" },
    { name: "Project Three", img: "/covers/proj3.jpg", details: "Satellite Data Visualization" },
  ];

  return (
    <section className="min-h-screen bg-black text-center py-20">
      <ScrollFloat text="Projects" className="text-5xl font-bold mb-12" />
      <div className="flex justify-center">
        <Folder title="My Work">
          <CircularGallery items={projects.map(p => ({ src: p.img, alt: p.name }))} />
        </Folder>
      </div>
    </section>
  );
}
