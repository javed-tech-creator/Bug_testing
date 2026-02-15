import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";
import { Bell, Monitor } from "lucide-react";
import PropTypes from "prop-types";

export function StatisticsCard({ color, icon, title, value, footer }) {
  console.log(icon)
  return (
    <Card className="border border-gray-200 shadow-sm  border-l-4 border-l-black">
      <CardHeader
        variant="gradient"
        color={color}
        floated={false}
        shadow={false}
        className="absolute grid h-12 w-12 place-items-center"
      >
        {icon}
      </CardHeader>
      {/* <CardHeader variant="gradient" className="absolute m-2 grid h-12 w-12 place-items-center">
        <Monitor/>
      </CardHeader> */}
      <CardBody className="p-4 text-right">
        <Typography variant="small" className="font-normal text-gray-600">
          {title}
        </Typography>
        <Typography variant="h4" color="gray">
          {value}
        </Typography>
      </CardBody>
      {footer && (
        <CardFooter className="border-t border-gray-200/70 p-2">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
}

StatisticsCard.defaultProps = {
  color: "blue",
  footer: null,
};

StatisticsCard.propTypes = {
  color: PropTypes.oneOf([
    "white",
    "gray",
    "gray",
    "brown",
    "deep-orange",
    "orange",
    "amber",
    "yellow",
    "lime",
    "light-green",
    "green",
    "teal",
    "cyan",
    "light-blue",
    "blue",
    "indigo",
    "deep-purple",
    "purple",
    "pink",
    "red",
  ]),
  icon: PropTypes.node.isRequired,
  title: PropTypes.node.isRequired,
  value: PropTypes.node.isRequired,
  footer: PropTypes.node,
};


export default StatisticsCard;
