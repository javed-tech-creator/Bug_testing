import React from "react";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import { ClockIcon } from "@heroicons/react/24/solid";
import PageHeader from "../components/PageHeader";
import Chart from "react-apexcharts";
import useCardsData from "../data/CardsData";
import useChartsData from "../data/ChartsData";
import CardSkeleton from "../../../components/skeleton/CardSkeleton";
import ChartSkeleton from "../../../components/skeleton/ChartSkeleton";
import EmployeeListPage from '../pages/overview/EmployeeListPage'
import { useSelector } from "react-redux";
export function Home() {
  const { ChartsData , isLoading:chartLoading, error:chartError } = useChartsData();
  const { CardsData, isLoading, error } = useCardsData();
 const res = useSelector((state) => state.auth.userData);
 const user = res?.user
  return (
    <div className=" px-4 ">
      <PageHeader title="Dashboard" />
      <div className="mb-8 w-full grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        {isLoading || error ? (
          isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-w-[68rem] overflow-hidden">
              {Array.from({ length: 4 }).map((_, index) => (
                <CardSkeleton key={index} />
              ))}
            </div>
          ) : (
            <div className="text-red-500 text-center">
            {error?.message || "Error Loading Dashboard Data"}  
            </div>
          )
        ) : Array.isArray(CardsData) && CardsData.length > 0 ? (
          CardsData.map(({ icon, title, footer, ...rest }) => (
            <DashboardCard
              key={title}
              {...rest}
              title={title}
              icon={React.createElement(icon, {
                className: "w-6 h-6 text-black",
              })}
              footer={
                <Typography className="font-normal capitalize text-gray-600">
                  <strong className={footer.color}>{footer.value}</strong>
                  &nbsp;{footer.label}
                </Typography>
              }
            />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 font-medium">
            Data Not Found
          </div>
        )}
      </div>
      <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
        {chartLoading || chartError ? (
          chartLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 min-w-[68rem] overflow-hidden">
              {Array.from({ length: 3 }).map((_, index) => (
                <ChartSkeleton key={index} />
              ))}
            </div>
          ) : (
            <div className="text-red-500 text-center">
            {error?.message || "Error Loading Dashboard Data"}  
            </div>
          )
        ) : Array.isArray(ChartsData) && ChartsData.length > 0 ? (
         ChartsData.map((props) => (
          <DashboardChart
            key={props.title}
            {...props}
            footer={
              <Typography
                variant="small"
                className="flex items-center font-normal text-gray-600"
              >
                <ClockIcon strokeWidth={2} className="h-4 w-4 text-gray-400" />
                &nbsp;{props.footer}
              </Typography>
            }
          />
        ))
        ) : (
          <div className="col-span-full text-center text-gray-500 font-medium">
            Data Not Found
          </div>
        )}
      </div>
      { user?.designation == true && <EmployeeListPage/>}
    </div>
  );
}

function DashboardCard({ color, icon, title, value, footer }) {
  return (
    // <Card className="border border-gray-200 shadow-sm  border-l-4 border-l-black">
    //   <CardHeader
    //     variant="gradient"
    //     color={color}
    //     floated={false}
    //     shadow={false}
    //     className="absolute grid h-12 w-12 place-items-center"
    //   >
    //     {icon}
    //   </CardHeader>
    //   {/* <CardHeader variant="gradient" className="absolute m-2 grid h-12 w-12 place-items-center">
    //     <Monitor/>
    //   </CardHeader> */}
    //   <CardBody className="p-4 text-right">
    //     <Typography className="text-lg font-semibold text-gray-700">
    //       {title}
    //     </Typography>
    //     <Typography variant="h4" color="gray">
    //       {value}
    //     </Typography>
    //   </CardBody>
    //   {footer && (
    //     <CardFooter className="border-t border-gray-200/70 p-2">
    //       {footer}
    //     </CardFooter>
    //   )}
    // </Card>
    <></>
  );
}

function DashboardChart({ color, chart, title, description, footer }) {
  return (
    // <Card className="border border-gray-200 shadow-sm">
    //   <CardHeader
    //     variant="gradient"
    //     color={color}
    //     floated={false}
    //     shadow={false}
    //   >
    //     <Chart {...chart} />
    //   </CardHeader>
    //   <CardBody className="px-6 pt-0">
    //     <Typography variant="h6" color="gray">
    //       {title}
    //     </Typography>
    //     <Typography variant="small" className="font-normal text-gray-600">
    //       {description}
    //     </Typography>
    //   </CardBody>
    //   {footer && (
    //     <CardFooter className="border-t border-gray-200/70 px-6 py-5">
    //       {footer}
    //     </CardFooter>
    //   )}
    // </Card>
    <></>
  );
}
export default Home;
