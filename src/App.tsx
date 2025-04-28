import {
  Box,
  Container,
  Flex,
  Heading,
  Button,
  Table,
  Text,
} from "@radix-ui/themes";
import { useSuiClient } from "@mysten/dapp-kit";
import { useState } from "react";

interface QueryResult {
  address: string;
  amount: number;
  claimed: boolean;
}

function App() {
  const suiClient = useSuiClient();
  const [addresses, setAddresses] = useState("");
  const [results, setResults] = useState<QueryResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const addressList = addresses.split("\n").filter((addr) => addr.trim());
      const queryResults: QueryResult[] = [];

      for (const address of addressList) {
        try {
          const response = await suiClient.getDynamicFieldObject({
            parentId:
              "0xbe16e2dea5740e8026ad4459f092d1f0c2f19eb355fff249d6d024d47942c0a6",
            name: { type: "address", value: address.trim() },
          });

          if (response.data?.content?.dataType === "moveObject") {
            const content = response.data.content as any;
            const amount = content.fields.value.fields.amount;
            const claimed = content.fields.value.fields.claimed;
            queryResults.push({
              address: address.trim(),
              amount: Number(amount) / 1000000000,
              claimed,
            });
          }
        } catch (error) {
          console.error(`Error fetching data for address ${address}:`, error);
          queryResults.push({
            address: address.trim(),
            amount: 0,
            claimed: false,
          });
        }
      }

      setResults(queryResults);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        padding: "2rem 0",
      }}
    >
      <style>
        {`
          textarea::placeholder {
            color: #000000 !important;
            font-size: 0.8rem !important;
            opacity: 1;
          }
        `}
      </style>
      <Container size="3">
        <Flex direction="column" gap="5" align="center">
          <Box style={{ textAlign: "center", marginBottom: "2rem" }}>
            <Heading
              size="8"
              style={{
                color: "#1a1a1a",
                marginBottom: "0.5rem",
                fontWeight: "bold",
              }}
            >
              Haedal TGE Check
            </Heading>
            <Text size="3" style={{ color: "#666" }}>
              查询您的 Haedal 空投信息
            </Text>
          </Box>

          <Box
            style={{
              width: "100%",
              maxWidth: "680px",
              padding: "0 1rem",
            }}
          >
            <textarea
              placeholder="请输入Sui钱包地址，每行一个地址"
              value={addresses}
              onChange={(e) => setAddresses(e.target.value)}
              className="custom-textarea"
              style={{
                width: "100%",
                marginBottom: "1.5rem",
                minHeight: "100px",
                padding: "0.5rem",
                borderRadius: "6px",
                border: "1px solid #e2e8f0",
                fontSize: "0.8rem",
                resize: "vertical",
                background: "white",
                color: "#1a1a1a",
              }}
            />
            <Flex justify="center">
              <Button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  width: "200px",
                  padding: "0.75rem",
                  fontSize: "1rem",
                  background: loading ? "#94a3b8" : "#3b82f6",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                }}
              >
                {loading ? "查询中..." : "查询空投信息"}
              </Button>
            </Flex>
          </Box>

          {results.length > 0 && (
            <Box
              style={{
                width: "100%",
                maxWidth: "800px",
                background: "white",
                padding: "2rem",
                borderRadius: "12px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Table.Root>
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeaderCell
                      style={{
                        background: "#f8fafc",
                        fontWeight: "bold",
                        color: "#1e293b",
                      }}
                    >
                      地址
                    </Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell
                      style={{
                        background: "#f8fafc",
                        fontWeight: "bold",
                        color: "#1e293b",
                      }}
                    >
                      数量
                    </Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell
                      style={{
                        background: "#f8fafc",
                        fontWeight: "bold",
                        color: "#1e293b",
                      }}
                    >
                      是否已领取
                    </Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {results.map((result, index) => (
                    <Table.Row
                      key={index}
                      style={{
                        borderBottom: "1px solid #e2e8f0",
                      }}
                    >
                      <Table.Cell style={{ color: "#1e293b" }}>
                        {result.address}
                      </Table.Cell>
                      <Table.Cell
                        style={{
                          color: "#3b82f6",
                          fontWeight: "bold",
                        }}
                      >
                        {result.amount.toFixed(2)}
                      </Table.Cell>
                      <Table.Cell
                        style={{
                          color: result.claimed ? "#10b981" : "#ef4444",
                          fontWeight: "bold",
                        }}
                      >
                        {result.claimed ? "是" : "否"}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Box>
          )}
        </Flex>
      </Container>
    </div>
  );
}

export default App;
