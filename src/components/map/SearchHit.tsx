import { Badge, Card, CardBody, CardHeader, Heading, Link, Text } from "@chakra-ui/react";
import { type JSX } from "react";
import { Popup } from "react-leaflet";
import { Link as ReactRouterLink } from "react-router-dom";
import { FadeInImage } from "./FadeInImage";

interface SearchHitsProps {
  title: string;
  description: string;
  imageUrl?: string;
  targetUrl?: string;
  attribution?: string;
  distanceKm?: number;
}

export default function SearchHit({
  title,
  description,
  imageUrl,
  targetUrl,
  distanceKm,
  attribution,
}: SearchHitsProps): JSX.Element {
  return (
    <Popup maxWidth={400} closeButton={false}>
      <Link as={ReactRouterLink} to={targetUrl} target="_blank" rel="noreferrer" outlineOffset={0}>
        <Card overflow="hidden" shadow="none" width="xs" border={0} outline={0}>
          <FadeInImage src={imageUrl} alt={title} height={60} />
          {distanceKm && (
            <Badge colorScheme="blue" position="absolute" top={1} right={1}>
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
            {attribution && (
              <Text fontSize="10px" fontStyle="italic" color="gray.500" mt={1}>
                {attribution}
              </Text>
            )}
          </CardBody>
        </Card>
      </Link>
    </Popup>
  );
}
