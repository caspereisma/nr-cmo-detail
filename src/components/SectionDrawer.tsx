import {
  Box,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { sections, sectionId } from "./FormSectionGrid";

interface SectionDrawerProps {
  activeIndex: number | null;
  onSelect: (index: number) => void;
}

export default function SectionDrawer({
  activeIndex,
  onSelect,
}: SectionDrawerProps) {
  const handleClick = (index: number) => {
    onSelect(index);
    const el = document.getElementById(sectionId(sections[index].title));
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 256,
        width: "100%",
        flexShrink: 0,
        bgcolor: "background.paper",
        overflow: "hidden",
      }}
    >
      <List sx={{ pt: 4, pb: 1 }}>
        {sections.map((section, index) => (
          <ListItemButton
            key={index}
            selected={index === activeIndex}
            onClick={() => handleClick(index)}
            component="a"
            href={`#${sectionId(section.title)}`}
            sx={{
              px: 2,
              py: 1,
              textDecoration: "none",
              "&.Mui-selected": {
                bgcolor: "rgba(64,64,65,0.08)",
              },
              "&.Mui-selected:hover": {
                bgcolor: "rgba(64,64,65,0.12)",
              },
            }}
          >
            <ListItemText
              primary={section.title}
              primaryTypographyProps={{
                variant: "body1",
                color: "text.primary",
              }}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
