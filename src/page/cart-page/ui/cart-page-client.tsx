"use client";
import { CartItem } from "./cart-item";
import React, { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@shared/stores/cart.store";
import { Label } from "../../../shared/ui/label";
import { Input } from "@shared/ui/input";
import { IMaskInput } from "react-imask";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@shared/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@shared/ui/command";
import { Popover } from "@shared/ui/popover";
import { PopoverTrigger } from "@shared/ui/popover";
import { PopoverContent } from "@shared/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";

import { cities } from "./cities";
import { cn, formatPrice } from "@shared/utils/utils";
import { RadioGroup, RadioGroupItem } from "@shared/ui/radio-group";
import { useEffect } from "react";
import { useCdekOffices } from "../api";
import { usePromoCode } from "../api/use-promocode";

type CheckoutFormData = {
  name: string;
  phone: string;
  email: string;
  promocode: string;
  city: string;
  delivery: string;
  region: string;
  street: string;
  house: string;
  apartment: string;
  postcode: string;
  cdek_pvz: string;
};

const CartPageClient = () => {
  const { items } = useCartStore();

  const [openCdekCity, setOpenCdekCity] = useState(false);
  const [openCdekPvz, setOpenCdekPvz] = useState(false);

  const {
    promoCode,
    loading: promoLoading,
    error: promoError,
    checkPromoCode,
    clearPromoCode,
    usePromoCode: markPromoCodeAsUsed,
  } = usePromoCode();

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<CheckoutFormData>({
    mode: "onChange",
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      promocode: "",
      city: "",
      delivery: "cdek",
      region: "",
      street: "",
      house: "",
      apartment: "",
      postcode: "",
      cdek_pvz: "",
    },
  });

  const cdekCity = watch("city");
  const {
    data: cdekOffices,
    loading: cdekLoading,
    error: cdekError,
  } = useCdekOffices(watch("delivery") === "cdek" ? cdekCity : undefined);

  // Геолокация и автозаполнение ближайшего города
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        // Функция для расчёта расстояния между двумя точками (Хаверсин)
        function getDistance(
          lat1: number,
          lon1: number,
          lat2: number,
          lon2: number
        ) {
          const toRad = (v: number) => (v * Math.PI) / 180;
          const R = 6371; // км
          const dLat = toRad(lat2 - lat1);
          const dLon = toRad(lon2 - lon1);
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) *
              Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) *
              Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          return R * c;
        }
        let minDist = Infinity;
        let nearestCity = null;
        for (const city of cities) {
          if (city.latitude && city.longitude) {
            const dist = getDistance(
              latitude,
              longitude,
              city.latitude,
              city.longitude
            );
            if (dist < minDist) {
              minDist = dist;
              nearestCity = city;
            }
          }
        }
        if (nearestCity) {
          setValue("city", nearestCity.city);
        }
      });
    }
  }, [setValue]);

  // Валидация для ФИО
  const nameValidate = (value: string) => {
    const parts = value.trim().split(/\s+/);
    return parts.length >= 3 && parts.every((part) => part.length >= 2);
  };
  // Валидация для email
  const emailValidate = (value: string) => {
    return /^[\w-.]+@[\w-]+\.[a-z]{2,}$/i.test(value);
  };
  const regionValidate = (value: string) => value.trim().length >= 2;
  const streetValidate = (value: string) => value.trim().length >= 2;
  const houseValidate = (value: string) =>
    /^[\w\d]+$/.test(value) && value.trim().length >= 1;
  const apartmentValidate = (value: string) =>
    /^[\w\d]+$/.test(value) && value.trim().length >= 1;
  const postcodeValidate = (value: string) => /^\d{6}$/.test(value);

  // onSubmit теперь только отправка, без ручной валидации
  const onSubmit = async (data: CheckoutFormData) => {
    // const normalize = (str: string) =>
    //   str
    //     .trim()
    //     .split(/\s+/)
    //     .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    //     .join(" ");
    // const normalized = {
    //   ...data,
    //   name: normalize(data.name),
    //   email: data.email.trim().toLowerCase(),
    //   region: normalize(data.region),
    //   street: normalize(data.street),
    //   house: data.house.trim(),
    //   apartment: data.apartment.trim(),
    //   postcode: data.postcode.replace(/\D/g, ""),
    // };

    // Если есть промокод, увеличиваем счетчик использований
    if (promoCode && data.promocode) {
      const success = await markPromoCodeAsUsed(data.promocode);
      if (!success) {
        console.error("Не удалось использовать промокод");
        return;
      }
    }

    const orderData = {
      ...data,
      promoCode: promoCode
        ? {
            code: promoCode.code,
            discount: promoCode.discount,
          }
        : null,
      total: (() => {
        const subtotal = items.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );
        const discount = promoCode ? (subtotal * promoCode.discount) / 100 : 0;
        return subtotal - discount;
      })(),
    };

    console.log(orderData);
  };

  const clearDeliveryFields = () => {
    setValue("region", "");
    setValue("street", "");
    setValue("house", "");
    setValue("apartment", "");
    setValue("postcode", "");
    setValue("cdek_pvz", "");
  };

  return (
    <>
      <div className="order-2 lg:order-1">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col lg:gap-8 gap-6"
        >
          <div className="flex flex-col lg:gap-4 gap-1">
            <Label>ФИО</Label>
            <Input
              {...register("name", { validate: nameValidate })}
              placeholder="Матвей Маслов Маслович"
              className={cn(errors.name && "border-destructive")}
            />
          </div>
          <div className="flex flex-col lg:gap-4 gap-1">
            <Label>Номер телефона</Label>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <IMaskInput
                  {...field}
                  mask="+7 (000) 000-00-00"
                  placeholder="+7 (123) 456-78-90"
                  className="lg:text-2xl md:text-xl sm:text-lg text-base lg:px-[50px] md:px-[30px] px-[20px] uppercase bg-card lg:h-[70px] md:h-[60px] h-[50px] lg:rounded-3xl md:rounded-2xl rounded-xl focus:outline-none placeholder:text-muted-foreground "
                />
              )}
            />
          </div>
          <div className="flex flex-col lg:gap-4 gap-1">
            <Label>Email</Label>
            <Input
              {...register("email", { validate: emailValidate })}
              placeholder="matthew@maslov.com"
              type="email"
              className={cn(errors.email && "border-destructive")}
            />
          </div>
          <div className="flex flex-col col-span-2 w-full lg:gap-4 gap-1">
            <Label>Промокод</Label>
            <div className="relative">
              <Input
                {...register("promocode")}
                placeholder="Введите промокод"
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.trim()) {
                    checkPromoCode(value);
                  } else {
                    clearPromoCode();
                  }
                }}
                className={cn(
                  promoError && "border-destructive",
                  promoCode && "border-green-500",
                  "w-full"
                )}
              />
              {promoLoading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                </div>
              )}
              {promoCode && (
                <div className="absolute right-8 top-1/2 transform -translate-y-1/2 text-green-500">
                  <Check className="size-6" />
                </div>
              )}
            </div>
          </div>
          <Label className="mt-[40px] lg:text-4xl md:text-3xl sm:text-2xl text-xl font-semibold">
            Доставка
          </Label>

          <div className="flex flex-col lg:gap-4 gap-1">
            <Controller
              name="delivery"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={(value) => {
                    field.onChange(value);
                    clearDeliveryFields();
                  }}
                  value={field.value}
                  className="flex flex-col lg:gap-4 gap-1"
                >
                  <div className="flex flex-row items-center">
                    <RadioGroupItem value="cdek" />
                    <Label className="ml-3!">CDEK</Label>
                    <Label className="ml-3! text-muted-foreground lg:text-lg sm:text-base text-sm">
                      от 7 дней, от 500 ₽
                    </Label>
                  </div>
                  <div className="flex flex-row items-center">
                    <RadioGroupItem value="russia_post" />
                    <Label className="ml-3!">Почта России</Label>
                    <Label className="ml-3! text-muted-foreground lg:text-lg sm:text-base text-sm">
                      от 14 дней, от 200 ₽
                    </Label>
                  </div>
                  <div className="flex flex-row items-center">
                    <RadioGroupItem value="self" />
                    <Label className="ml-3!">Самовывоз</Label>
                    <Label className="ml-3! text-muted-foreground lg:text-lg sm:text-base text-sm">
                      Бесплатно
                    </Label>
                  </div>
                </RadioGroup>
              )}
            />
          </div>
          {/* Плашка с информацией о доставке */}
          {watch("delivery") === "cdek" && (
            <div className="flex flex-col lg:gap-4 gap-1">
              <Label className="lg:text-4xl md:text-3xl sm:text-2xl text-xl font-semibold mb-4">
                Адрес доставки
              </Label>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <Popover open={openCdekCity} onOpenChange={setOpenCdekCity}>
                    <PopoverTrigger asChild>
                      <Button
                        role="combobox"
                        aria-expanded={openCdekCity}
                        className="hover:bg-card/80 text-foreground lg:text-2xl md:text-xl sm:text-lg text-base lg:px-[50px]! md:px-[30px]! px-[20px]! uppercase bg-card lg:h-[70px] md:h-[60px] h-[50px] lg:rounded-3xl md:rounded-2xl rounded-xl focus:outline-none w-full border-none justify-start"
                      >
                        {field.value ? (
                          field.value
                        ) : (
                          <span className="text-muted-foreground">
                            Выберите город
                          </span>
                        )}
                        <ChevronsUpDown className="text-muted-foreground size-5" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0 rounded-3xl">
                      <Command className="text-2xl uppercase bg-card px-[30px]! py-[25px]! rounded-3xl focus:outline-none w-full border-none justify-start">
                        <CommandInput
                          placeholder="Введите город"
                          className="text-xl uppercase bg-card h-[70px] rounded-3xl focus:outline-none w-full border-none justify-start"
                        />
                        <CommandList>
                          <CommandEmpty className="text-3xl font-semibold my-8 text-center">
                            Город не найден
                          </CommandEmpty>
                          <CommandGroup>
                            {cities.map((city) => (
                              <CommandItem
                                key={city.code}
                                value={city.city}
                                onSelect={() => {
                                  field.onChange(city.city);
                                  setOpenCdekCity(false);
                                }}
                                className="text-2xl uppercase rounded-2xl py-3 cursor-pointer px-4"
                              >
                                {city.city}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    field.value === city.city
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )}
              />
              <Controller
                name="cdek_pvz"
                control={control}
                rules={{ required: watch("delivery") === "cdek" }}
                render={({ field }) => (
                  <Popover open={openCdekPvz} onOpenChange={setOpenCdekPvz}>
                    <PopoverTrigger asChild>
                      <Button
                        role="combobox"
                        aria-expanded={openCdekPvz}
                        className="hover:bg-card/80 text-foreground lg:text-2xl md:text-xl sm:text-lg text-base lg:px-[50px]! md:px-[30px]! px-[20px]! uppercase bg-card lg:h-[70px] md:h-[60px] h-[50px] lg:rounded-3xl md:rounded-2xl rounded-xl focus:outline-none w-full border-none justify-start"
                        disabled={!watch("city")}
                      >
                        {field.value ? (
                          field.value
                        ) : (
                          <span className="text-muted-foreground">
                            Выберите ПВЗ
                          </span>
                        )}
                        <ChevronsUpDown className="text-muted-foreground size-5" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0 rounded-3xl">
                      <Command className="text-2xl uppercase bg-card px-[30px]! py-[25px]! rounded-3xl focus:outline-none w-full border-none justify-start">
                        <CommandInput
                          placeholder="Введите ПВЗ"
                          className="text-xl uppercase bg-card h-[70px] rounded-3xl focus:outline-none w-full border-none justify-start"
                        />
                        <CommandList>
                          {cdekLoading && (
                            <div className="text-center py-4">
                              Загрузка ПВЗ...
                            </div>
                          )}
                          {cdekError && (
                            <div className="text-center py-4 text-red-500">
                              Ошибка загрузки ПВЗ
                            </div>
                          )}
                          {!cdekLoading &&
                            !cdekError &&
                            cdekOffices &&
                            cdekOffices.length === 0 && (
                              <CommandEmpty className="text-3xl font-semibold my-8 text-center">
                                ПВЗ не найден
                              </CommandEmpty>
                            )}
                          <CommandGroup>
                            {cdekOffices &&
                              cdekOffices.map((office) => (
                                <CommandItem
                                  key={office.code}
                                  value={office.location.address}
                                  onSelect={() => {
                                    field.onChange(office.location.address);
                                    setOpenCdekPvz(false);
                                  }}
                                  className="text-2xl uppercase rounded-2xl py-3 cursor-pointer px-4"
                                >
                                  {office.location.address} ({office.code})
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      field.value === office.location.address
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )}
              />
            </div>
          )}

          {watch("delivery") === "russia_post" && (
            <div className="flex flex-col lg:gap-4 gap-1">
              <Label className="lg:text-4xl md:text-3xl sm:text-2xl text-xl font-semibold mb-4">
                Адрес доставки
              </Label>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <Popover open={openCdekCity} onOpenChange={setOpenCdekCity}>
                    <PopoverTrigger asChild>
                      <Button
                        role="combobox"
                        aria-expanded={openCdekCity}
                        className="hover:bg-card/80 text-foreground lg:text-2xl md:text-xl sm:text-lg text-base lg:px-[50px]! md:px-[30px]! px-[20px]! uppercase bg-card lg:h-[70px] md:h-[60px] h-[50px] lg:rounded-3xl md:rounded-2xl rounded-xl focus:outline-none w-full border-none justify-start"
                      >
                        {field.value ? (
                          field.value
                        ) : (
                          <span className="text-muted-foreground lg:px-[50px] md:px-[30px] px-[20px]">
                            Выберите город
                          </span>
                        )}
                        <ChevronsUpDown className="text-muted-foreground size-5" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0 rounded-3xl">
                      <Command className="text-2xl uppercase bg-card px-[30px]! py-[25px]! rounded-3xl focus:outline-none w-full border-none justify-start">
                        <CommandInput
                          placeholder="Введите город"
                          className="text-xl uppercase bg-card h-[70px] rounded-3xl focus:outline-none w-full border-none justify-start"
                        />
                        <CommandList>
                          <CommandEmpty className="text-3xl font-semibold my-8 text-center">
                            Город не найден
                          </CommandEmpty>
                          <CommandGroup>
                            {cities.map((city) => (
                              <CommandItem
                                key={city.code}
                                value={city.city}
                                onSelect={() => {
                                  field.onChange(city.city);
                                  setOpenCdekCity(false);
                                }}
                                className="text-2xl uppercase rounded-2xl py-3 cursor-pointer px-4"
                              >
                                {city.city}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    field.value === city.city
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )}
              />
              <Input
                {...register("region", {
                  validate: regionValidate,
                  required: watch("delivery") === "russia_post",
                })}
                placeholder="ОБЛАСТЬ"
                className={cn(errors.region && "border-destructive")}
              />
              <Input
                {...register("street", {
                  validate: streetValidate,
                  required: watch("delivery") === "russia_post",
                })}
                placeholder="УЛИЦА"
                className={cn(errors.street && "border-destructive")}
              />
              <div className="grid grid-cols-3 gap-4">
                <Input
                  {...register("house", {
                    validate: houseValidate,
                    required: watch("delivery") === "russia_post",
                  })}
                  placeholder="ДОМ"
                  className={cn(errors.house && "border-destructive")}
                />
                <Input
                  {...register("apartment", {
                    validate: apartmentValidate,
                    required: watch("delivery") === "russia_post",
                  })}
                  placeholder="КВАРТИРА"
                  className={cn(errors.apartment && "border-destructive")}
                />
                <Input
                  {...register("postcode", {
                    validate: postcodeValidate,
                    required: watch("delivery") === "russia_post",
                  })}
                  placeholder="ИНДЕКС"
                  className={cn(errors.postcode && "border-destructive")}
                />
              </div>
            </div>
          )}

          {watch("delivery") === "self" && (
            <div className="bg-card p-6 rounded-3xl">
              <p className="text-[18px] font-light leading-[120%] text-white/60">
                После оплаты заказа{" "}
                <b className="text-white">с вами свяжется менеджер </b>
                магазина для уточнения деталей <br />
                Самовывоз осуществляется на станции метро
                <b className="text-white"> «Охотный ряд» в центре Москвы</b>
                <br />
                Обращаем ваше <b className="text-white">внимание</b> на то, что{" "}
                <b className="text-white">точка самовывоза — это не магазин</b>,
                а именно пункт где вы можете
                <b> лично забрать свой заказ</b>
              </p>
            </div>
          )}
          {items.length > 0 && (
            <Button
              type="submit"
              disabled={!isValid}
              className=" lg:text-2xl md:text-xl sm:text-lg text-base lg:px-[50px] md:px-[30px] px-[20px] uppercase lg:h-[70px] md:h-[60px] h-[50px] lg:rounded-3xl md:rounded-2xl rounded-xl"
            >
              Оформить заказ
            </Button>
          )}
        </form>
      </div>
      <div className="order-1 lg:order-2">
        <section className="flex flex-col gap-8">
          {items.length > 0 ? (
            items.map((item) => <CartItem key={item.id} item={item} />)
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <h2 className="text-2xl font-semibold mb-4">Корзина пуста</h2>
              <p className="text-muted-foreground mb-6">
                Добавьте товары в корзину, чтобы продолжить покупки
              </p>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                Перейти к покупкам
              </Link>
            </div>
          )}
          {(() => {
            const subtotal = items.reduce(
              (acc, item) => acc + item.price * item.quantity,
              0
            );
            const discount = promoCode
              ? (subtotal * promoCode.discount) / 100
              : 0;
            const total = subtotal - discount;

            return (
              <>
                <div className="lg:my-[20px] md:my-[10px] my-[5px] sm:text-3xl text-xl md:text-4xl 2xl:text-5xl font-semibold flex flex-row items-center justify-between">
                  <p>ИТОГО:</p>
                  <p>{formatPrice(total)} ₽ </p>
                </div>
              </>
            );
          })()}
        </section>
      </div>
    </>
  );
};

export default CartPageClient;
