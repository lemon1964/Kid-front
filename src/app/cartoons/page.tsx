// app/cartoons/page.tsx
"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/cartoons")
      .then(res => res.json())
      .then(data => setMovies(data.results));
  }, []);

  return (
    <>
      <div className="flex justify-start flex-wrap sm:gap-40 mb-4">
        <Link
          href="/"
          className="text-base sm:text-lg text-white bg-green-600 px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-500 transition"
        >
          На главную
        </Link>
        <motion.button
          whileHover={{ scale: 1.05 }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="bg-yellow-400 text-black font-bold px-6 py-3 rounded-xl shadow-lg hover:bg-yellow-300"
          onClick={() => router.push("/cartoons/cartoon")}
        >
          Хочу смотреть мультфильм!
        </motion.button>
      </div>
      <main className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        {movies.map(movie => (
          <div key={movie.id} className="rounded shadow p-2 bg-white">
            {movie.poster_path && (
              <Image
                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                alt={movie.title}
                width={300}
                height={450}
                className="rounded shadow-xl max-w-xs sm:max-w-sm md:max-w-md max-h-max object-contain"
              />
            )}
            <h2 className="text-sm font-bold">{movie.title}</h2>
            <p className="text-xs text-gray-600 line-clamp-3">{movie.overview}</p>
          </div>
        ))}
      </main>
    </>
  );
}
