interface Props {
  notes: string[];
}

const RecipeNotes = ({ notes }: Props) => {
  return (
    <div className="flex-none flex flex-col border-t px-2 pb-1 min-h-[95px] font-medium">
      <h4 className="font-semibold text-xl mb-[2px]">주의 및 참고사항</h4>
      <ul>
        {notes.map((note, i) => (
          <li className="leading-tight pl-1 text-lg" key={i}>{`${
            i + 1
          }. ${note}`}</li>
        ))}
      </ul>
    </div>
  );
};

export default RecipeNotes;
