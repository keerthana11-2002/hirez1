import { getSavedJobs } from "@/api/apijobs";
import JobCard from "@/components/jobCard";
import useFetch from "@/hooks/useFetch";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";

const SavedJobs = () => {
  const { isLoaded } = useUser();

  const {
    loading: loadingSavedJobs,
    data: savedJobs,
    fn: fnSavedJobs,
  } = useFetch(getSavedJobs);

  useEffect(() => {
    if (isLoaded) {
      fnSavedJobs();
    }
  }, [isLoaded]);

  if (!isLoaded || loadingSavedJobs) {
    return <BarLoader className="mb-4" width={"100%"} color="blue" />;
  }

  return (
    <div className="px-4 mt-5   sm:ml-10 md:ml-20">
      <h1 className="gradient-title font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-5xl text-center ">
        Saved Jobs
      </h1>

      {loadingSavedJobs === false && (
        <div className="mt-5 xl:-mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xl:p-10 xl:-ml-20">
          {savedJobs?.length ? (
            savedJobs?.map((saved) => {
              return (
                <JobCard
                  key={saved.id}
                  job={saved?.job}
                  onJobAction={fnSavedJobs}
                  savedInit={true}
                />
              );
            })
          ) : (
            <div className="lg:ml-48 text-center text-md">No Saved Jobs 👀</div>
          )}
        </div>
      )}
    </div>
  ); 
};

export default SavedJobs;
