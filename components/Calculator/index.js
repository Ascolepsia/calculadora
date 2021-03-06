import { useState, useEffect, useRef } from "react";
import {
  Container,
  Box,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Button,
  Text,
  Stack,
} from "@chakra-ui/react";

export default function Calculator() {
  const [form, setForm] = useState({
    minimum: 0.5,
    glycaemia: "",
    ratio: "",
    //to calculate the correction you can use 1700/average total insulin in a day
    correction: "",
    objective: "",
    carbohydrates: "",
  });
  const [result, setResult] = useState();
  const [showSliderValue, setShowSliderValue] = useState(false);
  const resultRef = useRef();

  /**
   * Runs on every refresh
   */
  useEffect(() => {
    console.log("form", form);
  }, [form]);

  /**
   * Runs on init only
   */
  useEffect(() => {
    const valueInStorage = localStorage.getItem("form");
    if (valueInStorage) {
      setForm(JSON.parse(valueInStorage));
    }
  }, []);

  const handleChange = (event) => {
    const { value, name } = event.target;
    setForm((prevState) => {
      const newForm = {
        ...prevState,
        [name]: Number(value),
      };
      localStorage.setItem("form", JSON.stringify(newForm));

      return newForm;
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    //food + correction
    let res =
      form.carbohydrates / form.ratio +
      (form.glycaemia - form.objective) / form.correction;
    console.log(res);
    //Round to minimum and then round for a fix for some strange cases
    res =
      Math.round(
        (Math.round(res / form.minimum) * form.minimum + Number.EPSILON) * 100
      ) / 100;
    setResult(res);
    if (resultRef.current) {
      resultRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
  };

  const handleSlider = (value) => {
    setForm((prevState) => {
      const newForm = {
        ...prevState,
        minimum: Number(value),
      };
      localStorage.setItem("form", JSON.stringify(newForm));

      return newForm;
    });
  };

  return (
    <Container maxW="md">
      <Box padding="4" bg="blue.50">
        <form onSubmit={handleSubmit}>
          <Stack spacing={1}>
            <FormControl id="minimum" isRequired>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <FormLabel>Unidad mínima:</FormLabel>
                <Text fontSize="xl" color="blue.400" fontWeight="bold">
                  {form.minimum}
                </Text>
              </Box>
              <FormHelperText>
                La mínima cantidad de insulina que se puede administrar.
              </FormHelperText>
              <Slider
                value={form.minimum}
                defaultValue={0.5}
                step={0.05}
                min={0.05}
                max={1}
                onChange={handleSlider}
                onChangeStart={() => setShowSliderValue(true)}
                onChangeEnd={() => setShowSliderValue(false)}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb>
                  {showSliderValue && (
                    <Box
                      position="absolute"
                      bottom="-40px"
                      bg="blue.200"
                      color="white"
                      borderRadius="4px"
                      padding="4px"
                      fontSize="14px"
                    >
                      {form.minimum}
                    </Box>
                  )}
                </SliderThumb>
              </Slider>
            </FormControl>
            <FormControl id="glycaemia" isRequired>
              <FormLabel>Glucemia</FormLabel>
              <FormHelperText>
                El valor de glucosa en sangre actual.
              </FormHelperText>
              <Input onChange={handleChange} type="number" name="glycaemia" />
            </FormControl>
            <FormControl id="ratio" isRequired>
              <FormLabel>Ratio de carbohidratos / insulina</FormLabel>
              <FormHelperText>
                La cantidad de carbohidratos para una unidad de insulina.
              </FormHelperText>
              <Input onChange={handleChange} type="number" name="ratio" />
            </FormControl>
            <FormControl id="correction" isRequired>
              <FormLabel>Factor de corrección</FormLabel>
              <FormHelperText>
                La cantidad de glucemia que reduce una unidad de insulina.
              </FormHelperText>
              <Input onChange={handleChange} type="number" name="correction" />
            </FormControl>
            <FormControl id="objective" isRequired>
              <FormLabel>Objetivo de glucemia</FormLabel>
              <FormHelperText>El valor ideal de glucemia.</FormHelperText>
              <Input onChange={handleChange} type="number" name="objective" />
            </FormControl>
            <FormControl id="carbohydrates" isRequired>
              <FormLabel>Carbohidratos</FormLabel>
              <FormHelperText>
                La cantidad de carbohidratos que va a consumir.
              </FormHelperText>
              <Input
                onChange={handleChange}
                type="number"
                name="carbohydrates"
              />
            </FormControl>
            <Button
              size="md"
              height="48px"
              width="200px"
              border="2px"
              colorScheme="blue"
              type="submit"
              style={{ margin: "24px auto" }}
            >
              Calcular
            </Button>
            <Box ref={resultRef} display="flex" justifyContent="center">
              <Text fontSize="6xl">{result}</Text>
            </Box>
          </Stack>
        </form>
      </Box>
    </Container>
  );
}
