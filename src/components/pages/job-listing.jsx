import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";
import useFetch from "@/hooks/useFetch";
import JobCard from "../jobCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { State } from "country-state-city";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCompanies } from "@/api/apicompanies";
import { getJobs } from "@/api/apijobs";

const JobListing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");

  const { isLoaded } = useUser();

  const { data: companies, fn: fnCompanies } = useFetch(getCompanies);

  const {
    loading: loadingJobs,
    data: jobs,
    fn: fnJobs,
  } = useFetch(getJobs, {
    location,
    company_id,
    searchQuery,
  });

  useEffect(() => {
    if (isLoaded) {
      fnCompanies();
    }
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded) fnJobs();
  }, [isLoaded, location, company_id, searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);

    const query = formData.get("search-query");
    if (query) setSearchQuery(query);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setCompany_id("");
    setLocation("");
  };

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="blue" />;
  }

  return (
    <div className="xl:p-14 mt-8">
      <h1 className=" gradient-title font-extrabold text-3xl sm:text-6xl text-center pb-4  lg:mb-4 xl:-mt-20">
        Latest Jobs
      </h1>
      <form
        onSubmit={handleSearch}
        className="h-14  p-3 flex flex-row w-full gap-2 items-center  "
      >
        <Input
          type="text"
          placeholder="Search Jobs by Title.."
          name="search-query"
          className="h-full flex-1  px-4 xl:py-5 text-md lg:text-xl   "
        />
        <Button
          type="submit"
          className="h-full sm:w-28 xl:p-5 p-4 lg:text-2xl"
          variant="blue"
        >
          Search
        </Button>
      </form>

      <div className="flex flex-col sm:flex-row gap-4 p-4">
        <Select value={location} onValueChange={(value) => setLocation(value)}>
          <SelectTrigger className="lg:text-gray-400 text-gray-400  lg:text-xl">
            <SelectValue placeholder="Filter by Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {State.getStatesOfCountry("IN").map(({ name }) => {
                return (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          value={company_id}
          onValueChange={(value) => setCompany_id(value)}
        >
          <SelectTrigger className="lg:text-gray-400 text-gray-400 lg:text-xl">
            <SelectValue placeholder="Filter by Company" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {companies?.map(({ name, id }) => {
                return (
                  <SelectItem key={name} value={id}>
                    {name}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button
          className="sm:w-1/2 lg:text-2xl"
          variant="destructive"
          onClick={clearFilters}
        >
          Clear Filters
        </Button>
      </div>

      {loadingJobs && (
        <BarLoader className="mt-8" width={"100%"} color="blue" />
      )}

      {loadingJobs === false && (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3  lg:gap-6">
          {jobs?.length ? (
            jobs.map((job) => {
              return (
                <JobCard
                  key={job.id}
                  job={job}
                  savedInit={job?.saved?.length > 0}
                />
              );
            })
          ) : (
            <div className="xl:text-3xl xl:text-center ml-10">
              No Jobs Found 😢
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobListing;
