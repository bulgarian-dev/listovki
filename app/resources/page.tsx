"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { motion } from "framer-motion";
import { Tabs, Tab } from "@heroui/tabs";
import { Spinner } from "@heroui/spinner";
import ResourceRenderer from "@/components/custom/resource-renderer";

interface Resource {
  id: string;
  title: string;
  description: string;
  type: string;
}

interface ResourcesData {
  resources: Resource[];
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedResource, setSelectedResource] = useState<string | null>(null);
  const [resourceData, setResourceData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadResources = async () => {
      try {
        const response = await fetch("/resources/index.json");
        if (!response.ok) {
          throw new Error("Failed to load resources index");
        }
        const data: ResourcesData = await response.json();
        setResources(data.resources);

        if (data.resources.length > 0) {
          setSelectedResource(data.resources[0].id);
        }
      } catch (error) {
        console.error("Error loading resources index:", error);
      }
    };

    loadResources();
  }, []);

  useEffect(() => {
    const loadResourceData = async () => {
      if (!selectedResource) return;

      setLoading(true);
      try {
        const response = await fetch(`/resources/${selectedResource}.json`);
        if (!response.ok) {
          throw new Error(`Failed to load resource: ${selectedResource}`);
        }
        const data = await response.json();
        setResourceData(data);
      } catch (error) {
        console.error("Error loading resource data:", error);
        setResourceData(null);
      } finally {
        setLoading(false);
      }
    };

    loadResourceData();
  }, [selectedResource]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const renderResourceContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      );
    }

    if (!resourceData) {
      return (
        <div className="text-center text-default-500 h-64 flex items-center justify-center">
          Select a resource to view its content
        </div>
      );
    }

    const currentResource = resources.find((r) => r.id === selectedResource);

    return (
      <ResourceRenderer
        data={resourceData}
        type={currentResource?.type || ""}
      />
    );
  };

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-center mb-2">Resources</h1>
      <p className="text-center text-sm text-default-600 mb-10">
        Helpful resources for the Bulgarian driver's license
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <motion.div
          className="lg:col-span-3"
          variants={container}
          initial="hidden"
          animate="show">
          <Card>
            <CardHeader className="pb-0 pt-4 px-4">
              <h4 className="font-bold text-large">Available Resources</h4>
            </CardHeader>
            <CardBody>
              <Tabs
                aria-label="Resources"
                variant="light"
                color="primary"
                selectedKey={selectedResource || ""}
                onSelectionChange={(key) => setSelectedResource(key as string)}
                classNames={{
                  tabList: "flex-col items-start",
                  cursor: "w-full",
                  tab: "max-w-full w-full justify-start",
                }}>
                {resources.map((resource) => (
                  <Tab key={resource.id} title={resource.title}>
                    <div className="text-sm text-default-500 mt-1">
                      {resource.description}
                    </div>
                  </Tab>
                ))}
              </Tabs>
            </CardBody>
          </Card>
        </motion.div>

        <motion.div className="lg:col-span-9" variants={item}>
          <Card className="h-full">
            <CardHeader className="pb-0 pt-4 px-4">
              <h4 className="font-bold text-large">
                {resources.find((r) => r.id === selectedResource)?.title ||
                  "Resource Details"}
              </h4>
            </CardHeader>
            <CardBody>{renderResourceContent()}</CardBody>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
