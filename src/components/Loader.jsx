import CountUp from "@/reactbits/TextAnimations/CountUp/CountUp";

export default function Loader({ onDone }) {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-black text-white">
      <p className="text-4xl font-bold">
        <CountUp from={0} to={100} duration={3} onEnd={onDone} />%
      </p>
      <p className="mt-4 text-lg">Loading...</p>
    </div>
  );
}
