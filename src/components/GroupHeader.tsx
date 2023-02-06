const GroupHeder = (props: { name: string; members: number }) => {
  return (
    <div class="bg-base-300 w-full flex justify-between h-20 align-middle">
      <div class="flex items-center m-4">
        <h1 class="md:text-2xl font-bold text-base-content">{props.name}</h1>
      </div>
      <div class="flex items-center m-4">
        <p>{props.members} members</p>
      </div>
    </div>
  );
};

export default GroupHeder;
