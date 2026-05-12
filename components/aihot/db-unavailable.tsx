export function DbUnavailable() {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "4rem 2rem",
        background: "var(--sage4)",
        borderRadius: "var(--radius-card)",
        marginTop: "1rem",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "1.2rem",
          color: "var(--char3)",
          marginBottom: ".5rem",
        }}
      >
        数据库未连接
      </p>
      <p style={{ fontSize: ".82rem", color: "var(--char3)", lineHeight: 1.6 }}>
        请在 .env.local 中配置 DATABASE_URL 后重启开发服务器。
        <br />
        参考 TODO-aihot.md 完成数据库部署步骤。
      </p>
    </div>
  );
}
