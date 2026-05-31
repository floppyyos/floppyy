import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#0000aa] p-8 font-mono text-white">
      <div className="max-w-[720px] w-full text-[14px] leading-[22px]">
        {/* Title bar */}
        <div className="mb-6 text-center">
          <span className="bg-[#a8a8a8] px-4 py-[2px] text-[#0000aa] font-bold">
            Floppyy
          </span>
        </div>

        {/* Error message */}
        <p className="mb-4">
          An exception 0E has occurred at 0028:C0034B03 in VxD VFAT(01) +
          00001840. This was called from 0028:C001624azz in VxD IOS(04) +
          00006C2A.
        </p>

        <p className="mb-4">
          The current application will be terminated.
        </p>

        <p className="mb-2">
          *  Error 404: The page you requested could not be found on this server.
        </p>
        <p className="mb-2">
          *  The system was unable to locate the specified URL in the
        </p>
        <p className="mb-4">
          {"   "}virtual file system. The resource may have been moved or deleted.
        </p>

        <p className="mb-6">
          Press any key to return to the desktop, or
        </p>

        <p className="mb-8">
          *  Press CTRL+ALT+DEL to restart your computer. You will lose any
          {"\n   "}unsaved information in all applications.
        </p>

        {/* Action prompt */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-block bg-[#a8a8a8] px-8 py-[2px] text-[#0000aa] font-bold hover:bg-white no-underline"
          >
            Press any key to continue _
          </Link>
        </div>
      </div>
    </div>
  );
}
