import axios from "axios";

const API_URL = "https://stg.integrations.api.bold.co";
//const API_URL = "https://8ixi9wd380.execute-api.us-east-1.amazonaws.com/dev";

const key = "x-api-key MdZnO5yNwGE1eUryqJZ3eH_LLW3lAgc7JdxVjwBlXLM"

export const processPayment = async (amount: number) => {
  try {
    const response = await axios.post(
      `${API_URL}/payments/app-checkout`,
      {
        amount: {
          currency: "COP",
          taxes: [
            {
              type: "VAT",
              base: 900,
              value: 100,
            },
          ],
          tip_amount: 0,
          total_amount: amount,
        },
        payment_method: "POS",
        terminal_model: "N86",
        terminal_serial: "N860W200706",
        // terminal_serial: "N860WN00467",
        reference: "prueba1",
        // user_email: "lina.toquica@bold.co",
        user_email: "jose.sanchez+stg_@bold.co",
        description: "Compra de Prueba",
        payer: {
          email: "linamtoquica@gmail.com",
          phone_number: "3194913703",
          document: {
            document_type: "CEDULA",
            document_number: "1010140000",
          },
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: key
        },
      }
    );
    console.log({response})
    return response.data;
  } catch (error) {
    console.error("Error processing payment:", error);
    throw error;
  }
};

export const checkPaymentStatus = async () => {
  try {
    const response = await axios.get(`${API_URL}/payments/webhook/notifications/prueba1?is_external_reference=true`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: key
        },
      }
    );
    const status = response.data.notifications.at(-1);
    return {
      state: status.type === 'SALE_APPROVED' ? 'success' : 'error',
      subject: status.subject
    }
  } catch (error) {
    console.error("Error checking payment status:", error);
    throw error;
  }
};
