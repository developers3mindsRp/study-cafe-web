import CourseCard from "../../CourseCard";


export default function MyCourses() {
  const courses = [
    {
      image: "/images/f1.jpg", 
      title: "Certification Course on Python with AI for Finance Professionals",
      lessons: 12,
      completed: 5,
      progress: 42,
    },
    {
      image: "/images/f2.png",
      title: "Practical Filing of GSTR-9 & GSTR-9C Certification Course",
      lessons: 12,
      completed: 12,
      progress: 100,
    },
    {
      image: "/images/f3.png",
      title: "Certification Course on How to Automate Your CA Practice with AI Tools",
      lessons: 15,
      completed: 5,
      progress: 42,
    }
  ];

  return (
    <section className="md:p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-1">
        My Courses
      </h2>
      <p className="text-gray-500 text-sm mb-6">
        Continue your learning Journey
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {courses.map((course, i) => (
     
          <CourseCard key={i} course={course} />
        ))}
      </div>
    </section>
  );
}
