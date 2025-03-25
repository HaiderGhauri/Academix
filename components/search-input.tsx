// "use client"

// import { Search } from "lucide-react"
// import { Input } from "./ui/input"
// import { useEffect, useState } from "react"
// import { useDebounce } from "@/hooks/use-debounce"
// import { usePathname, useRouter, useSearchParams } from "next/navigation"
// import qs  from "query-string";

// interface SearchInputProps {
//     initialTitle?: string;
//   }

// export const SearchInput = ({ initialTitle = "" }: SearchInputProps) => {
//     const [value, setValue] = useState(initialTitle);
//     const debouncedValue = useDebounce(value);

//     const searchParams = useSearchParams();
//     const router = useRouter();
//     const pathname = usePathname();

//     const currentCategoryId = searchParams.get("categoryId");

//     useEffect(() => {
//         const url = qs.stringifyUrl({
//             url: pathname,
//             query: {
//                 categoryId: currentCategoryId,
//                 title: debouncedValue,
//             }
//         }, { skipEmptyString: true, skipNull: true });

//         router.push(url);
//     }, [currentCategoryId, debouncedValue, pathname, router])

//     return (
//         <div className="relative">
//             <Search 
//                 className="h-4 w-4 absolute top-3 left-3 text-slate-600"
//             />
//             <Input
//                 value={value}
//                 onChange={(e) => setValue(e.target.value)} 
//                 className="w-full md:w-[300px] pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200"
//                 placeholder="Search a course"
//             />
//         </div>
//     )
// }

"use client"
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

interface SearchInputProps {
  initialTitle?: string;
}

export const SearchInput = ({ initialTitle = "" }: SearchInputProps) => {
  const [value, setValue] = useState(initialTitle);
  const [mounted, setMounted] = useState(false);
  const debouncedValue = useDebounce(value);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentCategoryId = searchParams.get("categoryId");

  useEffect(() => {
    setMounted(true); 
  }, []);

  useEffect(() => {
    const url = qs.stringifyUrl({
      url: pathname,
      query: { categoryId: currentCategoryId, title: debouncedValue },
    }, { skipEmptyString: true, skipNull: true });
    router.push(url);
  }, [currentCategoryId, debouncedValue, pathname, router]);

  if (!mounted) return null;

  return (
    <div className="relative">
      <Search className="h-4 w-4 absolute top-3 left-3 text-slate-600" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full md:w-[300px] pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200"
        placeholder="Search a course"
      />
    </div>
  );
};