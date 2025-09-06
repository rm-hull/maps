import { Badge, Box, Card, CardBody, CardHeader, Heading, Link, Text } from "@chakra-ui/react";
import { ReactNode } from "react";
import { Popup } from "react-leaflet";
import { Link as ReactRouterLink } from "react-router-dom";
import { FadeInImage, ImageLoaderFn } from "../FadeInImage";

interface ResultPopupProps {
  title: string;
  description: string;
  imageLoader?: ImageLoaderFn;
  imageUrl?: string;
  targetUrl?: string;
  attribution?: ReactNode;
  distanceKm?: number;
  chips?: string[];
}

export function ResultPopup({
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
    <Card.Root overflow="hidden" shadow="none" width="xs" border={0} outline={0}>
      {(imageUrl || imageLoader) && (
        <FadeInImage src={imageUrl} loader={imageLoader} alt={title} height={60} attribution={attribution} />
      )}
      {distanceKm && (
        <Badge colorScheme="blue" position="absolute" top={0} right={0} m={1}>
          {distanceKm} km
        </Badge>
      )}
      <Card.Header p={1} pb={0}>
        <Heading size="sm" maxLines={1}>
          {title}
        </Heading>
      </Card.Header>
      <Card.Body p={1} pt={0}>
        <Text fontSize="sm" maxLines={3} color="gray.600">
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
      </Card.Body>
    </Card.Root>
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
