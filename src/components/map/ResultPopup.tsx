import { Badge, Box, Card, CardBody, CardHeader, Heading, Link, Text } from "@chakra-ui/react";
import { FadeInImage, ImageLoaderFn } from "../FadeInImage";
import { Popup } from "react-leaflet";
import { Link as ReactRouterLink } from "react-router-dom";

interface ResultPopupProps {
  title: string;
  description: string;
  imageLoader?: ImageLoaderFn;
  imageUrl?: string;
  targetUrl?: string;
  attribution?: string;
  distanceKm?: number;
  chips?: string[];
}

export default function ResultPopup({
  title,
  description,
  imageUrl,
  imageLoader,
  targetUrl,
  distanceKm,
  attribution,
  chips,
}: ResultPopupProps) {
  const cardDetails = (
    <Card overflow="hidden" shadow="none" width="xs" border={0} outline={0}>
      {(imageUrl || imageLoader) && (
        <FadeInImage src={imageUrl} loader={imageLoader} alt={title} height={60} attribution={attribution} />
      )}
      {distanceKm && (
        <Badge colorScheme="blue" position="absolute" top={0} right={0} m={1}>
          {distanceKm} km
        </Badge>
      )}
      <CardHeader p={1} pb={0}>
        <Heading size="sm" noOfLines={1}>
          {title}
        </Heading>
      </CardHeader>
      <CardBody p={1} pt={0}>
        <Text fontSize="sm" noOfLines={3} color="gray.600">
          {description}
        </Text>
        {chips && (
          <Box gap={2}>
            {chips.map((chip) => (
              <Badge m={1} key={chip} colorScheme="blue">
                {chip.replaceAll("_", " ")}
              </Badge>
            ))}
          </Box>
        )}
        {/* {attribution && (
          <Text fontSize="10px" fontStyle="italic" color="gray.500" mt={1}>
            {attribution}
          </Text>
        )} */}
      </CardBody>
    </Card>
  );

  if (!targetUrl) {
    return (
      <Popup maxWidth={400} closeButton={false}>
        {cardDetails}
      </Popup>
    );
  }

  return (
    <Popup maxWidth={400} closeButton={false}>
      <Link as={ReactRouterLink} to={targetUrl} target="_blank" rel="noreferrer" outlineOffset={0}>
        {cardDetails}
      </Link>
    </Popup>
  );
}
