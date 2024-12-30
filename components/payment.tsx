import React, { useEffect, useState } from "react";
import { Alert, View } from "react-native";
import CustomButton from "./CustomButton";
import { PaymentSheetError, useStripe } from "@stripe/stripe-react-native";
import { fetchAPI } from "@/lib/fetch";
import { PaymentProps } from "@/types/type";

export default function Payment({ fullName, email, amount, rideTime, driverId }: PaymentProps) {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [success, setSuccess] = useState(false);

  // if not using some of the parameters, replace it with an _ underscore
  const confirmHandler = async (paymentMethod, _, intentCreationCallback) => {
    // Make a request to your own server.
    const { paymentIntent, customer } = fetchAPI("/(api)/(stripe)/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: fullName || email.split("@")[0],
        email: email,
        amount: amount,
        paymentMethodeId: paymentMethod.id,
      }),
    });

    // check for secret which allows payment
    if (paymentIntent.client_secret) {
      // call pay api
      const { result } = await fetchAPI("/(api)/(stripe)/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payment_method_id: paymentMethod.id,
          payment_intent_id: paymentIntent.id,
          customer_id: customer,
        }),
      });

      if (result.client_secret) {
        // create ride
      }
    }

    // Call the `intentCreationCallback` with your server response's client secret or error
    // const { client_secret, error } = await response.json();
    else {
      intentCreationCallback({ error });
    }
  };

  const initializePaymentSheet = async () => {
    const { error } = await initPaymentSheet({
      merchantDisplayName: "Example, Inc.",
      intentConfiguration: {
        mode: {
          amount: 1099,
          currencyCode: "USD",
        },
        confirmHandler: confirmHandler,
      },
    });
    if (error) {
      // handle error
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  const openPaymentSheet = async () => {
    await initializePaymentSheet();
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error ${error.code}`, error.message);
    } else {
      // Payment completed - show a confirmation screen.
      setSuccess(true);
    }

    // ...
  };
  return (
    <View className="mt-10">
      <CustomButton title="confirm ride" onPress={openPaymentSheet} />
    </View>
  );
}
