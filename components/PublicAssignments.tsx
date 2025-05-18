// components/PublicAssignments.tsx
import Link from "next/link";

export type PublicAssignment = {
  id: string;
  title: string;
  excerpt: string;
};

interface Props {
  assignments: PublicAssignment[];
}

export default function PublicAssignments({ assignments }: Props) {
  return (
    <section className="sm:max-w-4xl lg:max-w-7xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-8">課題一覧</h1>
      {assignments.length === 0 ? (
        <p className="text-center text-gray-500">
          現在、公開中の課題はありません。
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map((a) => (
            <Link
              key={a.id}
              href={`/assignments/${a.id}`}
              className="block bg-white shadow hover:shadow-md transition p-6 rounded-lg"
            >
              <h2 className="text-2xl font-semibold mb-2">{a.title}</h2>
              <p className="text-gray-700">{a.excerpt}</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
